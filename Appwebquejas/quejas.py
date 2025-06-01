from db.connection import obtener_conexion
from core.destinatarios_departamento import obtener_destinatarios
from core.filtro_quejas import revisar_queja
from services.email_utils import enviar_correo_masivo
from services.formulario_api import enviar_a_formulario
from core.config import FORMULARIO_ACTIVO
import datetime


def registrar_queja(usuario_id, problema, detalle, ciudad, departamento, clasificacion, soporte, para_beneficiario):
    """
    Registra una nueva queja en el sistema, la envía por correo y al formulario web externo.
    
    Args:
        usuario_id: ID del usuario que presenta la queja
        problema: Tipo de problema o queja
        detalle: Descripción detallada de la queja
        ciudad: Ciudad donde ocurrió el problema
        departamento: Departamento donde ocurrió el problema
        clasificacion: Tipo de atención requerida
        soporte: Lista de archivos adjuntos como soporte
        para_beneficiario: Booleano que indica si la queja es para un beneficiario
        
    Returns:
        String con el resultado de la operación
    """
    # Conexión a la base de datos
    conn = obtener_conexion()
    cursor = conn.cursor()

    # Obtener datos del usuario
    cursor.execute("SELECT nombre, apellido, cedula, celular, correo FROM usuarios WHERE id = %s", (usuario_id,))
    usuario = cursor.fetchone()
    if not usuario:
        return "Usuario no encontrado."

    nombre, apellido, cedula, celular, correo = usuario

    # Validar contenido de la queja
    es_apropiada, palabras_ofensivas = revisar_queja(detalle)
    if not es_apropiada:
        return f"La queja contiene lenguaje inapropiado: {', '.join(palabras_ofensivas)}. Por favor edítela antes de enviarla."

    # Convertir lista de archivos a string
    soporte_str = "; ".join(soporte) if soporte else None

    # Insertar en la base de datos
    try:
        cursor.execute("""
            INSERT INTO quejas (
                usuario_id, problema, detalle, ciudad, departamento, correo,
                clasificacion, soporte, para_beneficiario
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            usuario_id, problema, detalle, ciudad, departamento, correo,
            clasificacion, soporte_str, para_beneficiario
        ))
        conn.commit()
        # Obtener el ID de la queja recién insertada
        cursor.execute("SELECT lastval()")
        queja_id = cursor.fetchone()[0]
        print(f"✅ Queja registrada en la base de datos con ID: {queja_id}")
    except Exception as e:
        conn.rollback()
        print(f"❌ Error al registrar queja en base de datos: {e}")
        return f"Error al registrar la queja: {e}"
    finally:
        conn.close()

    # Obtener destinatarios según el departamento
    info_destinatarios = obtener_destinatarios(departamento)
    if not info_destinatarios:
        return f"No se ha configurado un correo destinatario para el departamento '{departamento}'."

    destinatarios = [info_destinatarios["principal"]] + info_destinatarios.get("copia", [])
    responsable = info_destinatarios.get("responsable", "Sin responsable asignado")

    # Construir cuerpo del correo para DESTINATARIOS (texto plano)
    cuerpo_destinatarios = f"""
NUEVA QUEJA DE SALUD
-------------------

Nombre: {nombre} {apellido}
Cédula: {cedula}
Celular: {celular}
Correo: {correo}
Atención: {clasificacion}
Departamento: {departamento}
Municipio: {ciudad}
Tipo de queja: {problema}
Responsable asignado: {responsable}

DETALLE:
{detalle}

Soportes adjuntos: {', '.join(soporte) if soporte else 'Ninguno'}

---
Este correo ha sido generado automáticamente por el sistema de Veeduría Nacional de Salud.
"""

    # Construir cuerpo del correo para el USUARIO (texto plano)
    cuerpo_usuario = f"""
COMPROBANTE DE REGISTRO DE QUEJA
-------------------------------

Estimado/a {nombre} {apellido},

Le informamos que su queja ha sido registrada exitosamente en nuestro sistema.
A continuación encontrará el detalle de su registro como comprobante:

Número de Registro: {queja_id}
Fecha: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
Tipo de Atención: {clasificacion}
Tipo de Queja: {problema}
Ubicación: {ciudad}, {departamento}

Su queja será atendida de acuerdo a la clasificación asignada. Es importante que conserve este
comprobante para cualquier seguimiento o consulta adicional que necesite realizar.

Para cualquier consulta relacionada con su caso, puede responder a este correo.

Atentamente,
Veeduría Nacional de Salud
Trabajando por mejorar los servicios de salud

---
Este es un comprobante oficial de su registro de queja. Por favor, consérvelo para futuras referencias.
"""

    # Variable para controlar si se envió al menos un correo
    correo_enviado_destinatarios = False
    correo_enviado_usuario = False
    mensaje_correo = ""

    # 1. Enviar correo a los DESTINATARIOS
    if destinatarios:
        try:
            enviar_correo_masivo(
                destinatarios=destinatarios,
                asunto=f"Nueva queja de salud - {problema}",
                cuerpo=cuerpo_destinatarios,
                reply_to=correo,
                archivos_adjuntos=soporte  # Agregar los archivos adjuntos
            )
            print("📧 Correo enviado a destinatarios institucionales:")
            print(f"   - Destinatarios: {', '.join(destinatarios)}")
            if soporte:
                print(f"   - Archivos adjuntos: {', '.join(soporte)}")
            correo_enviado_destinatarios = True
        except Exception as e:
            print(f"❌ Error al enviar correo a destinatarios: {e}")
            mensaje_correo += f"Error al enviar correo a destinatarios: {e}. "

    # 2. Enviar COMPROBANTE al usuario
    if correo and "@" in correo:
        try:
            enviar_correo_masivo(
                destinatarios=[correo],
                asunto=f"Comprobante de registro de queja - {problema}",
                cuerpo=cuerpo_usuario,
                reply_to="veedurianacionalsaludmagcol@gmail.com"  # Usando el correo de la veeduría como reply-to
            )
            print(f"📧 Comprobante enviado al usuario: {correo}")
            correo_enviado_usuario = True
        except Exception as e:
            print(f"❌ Error al enviar comprobante al usuario: {e}")
            mensaje_correo += f"Error al enviar comprobante al usuario: {e}. "
    else:
        print("⚠️ No se envió comprobante al usuario: correo no disponible o inválido")
        mensaje_correo += "No se pudo enviar comprobante al usuario: correo no disponible. "

    # Enviar al formulario web
    mensaje_formulario = ""
    try:
        # Verificar si el formulario está activo
        if not FORMULARIO_ACTIVO:
            print("ℹ️ Envío al formulario web desactivado en configuración.")
            mensaje_formulario = "Formulario web desactivado en configuración. "
        else:
            # Solo intentar enviar si está activo
            resultado = enviar_a_formulario(
                usuario_id=usuario_id,
                problema=problema,
                detalle=detalle,
                ciudad=ciudad,
                departamento=departamento,
                correo=correo,
                nombre=f"{nombre} {apellido}",
                cedula=cedula,
                telefono=celular
            )
            
            if not resultado:
                print("ℹ️ No se pudo enviar al formulario web.")
                mensaje_formulario = "No se pudo enviar al formulario web. "
            else:
                mensaje_formulario = "Enviado al formulario web correctamente. "
    except Exception as e:
        print(f"❌ Error al enviar a formulario: {e}")
        mensaje_formulario = f"Error al enviar al formulario web: {e}. "

    # Mensaje final para el usuario
    if not correo_enviado_destinatarios and not correo_enviado_usuario:
        return f"Queja registrada, pero no se pudo enviar por correo. {mensaje_correo}{mensaje_formulario}"
    elif not correo_enviado_usuario:
        return f"Queja registrada. No se pudo enviar comprobante a su correo. {mensaje_formulario}"
    else:
        return "Queja registrada con éxito. Se ha enviado un comprobante a su correo electrónico."


def obtener_quejas(usuario_id=None, limite=100):
    """
    Obtiene las quejas registradas en el sistema.
    
    Args:
        usuario_id: Si se proporciona, filtra las quejas de ese usuario
        limite: Número máximo de quejas a devolver
        
    Returns:
        Lista de quejas ordenadas por fecha descendente
    """
    conn = obtener_conexion()
    cursor = conn.cursor()
    
    try:
        if usuario_id:
            # Consulta para un usuario específico
            cursor.execute("""
                SELECT q.id, u.nombre, u.apellido, q.problema, q.detalle, q.ciudad, 
                       q.departamento, q.fecha, q.clasificacion, q.para_beneficiario
                FROM quejas q
                JOIN usuarios u ON q.usuario_id = u.id
                WHERE q.usuario_id = %s
                ORDER BY q.fecha DESC
                LIMIT %s
            """, (usuario_id, limite))
        else:
            # Consulta para todos los usuarios
            cursor.execute("""
                SELECT q.id, u.nombre, u.apellido, q.problema, q.detalle, q.ciudad, 
                       q.departamento, q.fecha, q.clasificacion, q.para_beneficiario
                FROM quejas q
                JOIN usuarios u ON q.usuario_id = u.id
                ORDER BY q.fecha DESC
                LIMIT %s
            """, (limite,))
        
        quejas = cursor.fetchall()
        return quejas
    except Exception as e:
        print(f"❌ Error al consultar quejas: {e}")
        return []
    finally:
        conn.close()


def obtener_detalle_queja(queja_id):
    """
    Obtiene los detalles completos de una queja específica.
    
    Args:
        queja_id: ID de la queja a consultar
        
    Returns:
        Diccionario con los detalles de la queja o None si no se encuentra
    """
    conn = obtener_conexion()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT q.id, u.nombre, u.apellido, u.cedula, u.celular, q.problema, 
                   q.detalle, q.ciudad, q.departamento, q.fecha, q.clasificacion, 
                   q.soporte, q.para_beneficiario, q.correo
            FROM quejas q
            JOIN usuarios u ON q.usuario_id = u.id
            WHERE q.id = %s
        """, (queja_id,))
        
        queja = cursor.fetchone()
        if not queja:
            return None
            
        # Convertir a diccionario para mejor acceso
        columnas = [
            'id', 'nombre', 'apellido', 'cedula', 'celular', 'problema', 
            'detalle', 'ciudad', 'departamento', 'fecha', 'clasificacion', 
            'soporte', 'para_beneficiario', 'correo'
        ]
        
        resultado = {columnas[i]: queja[i] for i in range(len(columnas))}
        
        # Convertir la cadena de soportes de nuevo a una lista
        if resultado['soporte']:
            resultado['soporte'] = resultado['soporte'].split('; ')
        else:
            resultado['soporte'] = []
            
        return resultado
    except Exception as e:
        print(f"❌ Error al consultar detalle de queja: {e}")
        return None
    finally:
        conn.close()


def eliminar_queja(queja_id, usuario_id=None):
    """
    Elimina una queja del sistema.
    
    Args:
        queja_id: ID de la queja a eliminar
        usuario_id: Si se proporciona, verifica que la queja pertenezca a ese usuario
        
    Returns:
        Booleano indicando si la operación fue exitosa y un mensaje
    """
    conn = obtener_conexion()
    cursor = conn.cursor()
    
    try:
        # Verificar si la queja existe y pertenece al usuario (si se proporciona usuario_id)
        if usuario_id:
            cursor.execute("SELECT id FROM quejas WHERE id = %s AND usuario_id = %s", (queja_id, usuario_id))
            if not cursor.fetchone():
                return False, "La queja no existe o no pertenece a este usuario."
        else:
            cursor.execute("SELECT id FROM quejas WHERE id = %s", (queja_id,))
            if not cursor.fetchone():
                return False, "La queja no existe."
        
        # Eliminar la queja
        cursor.execute("DELETE FROM quejas WHERE id = %s", (queja_id,))
        conn.commit()
        return True, "Queja eliminada con éxito."
    except Exception as e:
        conn.rollback()
        print(f"❌ Error al eliminar queja: {e}")
        return False, f"Error al eliminar la queja: {e}"
    finally:
        conn.close()


def estadisticas_quejas():
    """
    Genera estadísticas básicas sobre las quejas registradas.
    
    Returns:
        Diccionario con diferentes estadísticas
    """
    conn = obtener_conexion()
    cursor = conn.cursor()
    
    estadisticas = {
        "total_quejas": 0,
        "por_departamento": {},
        "por_clasificacion": {},
        "por_problema": {},
        "quejas_recientes": 0  # Últimos 30 días
    }
    
    try:
        # Total de quejas
        cursor.execute("SELECT COUNT(*) FROM quejas")
        estadisticas["total_quejas"] = cursor.fetchone()[0]
        
        # Quejas por departamento
        cursor.execute("""
            SELECT departamento, COUNT(*) as cantidad
            FROM quejas
            GROUP BY departamento
            ORDER BY cantidad DESC
        """)
        for row in cursor.fetchall():
            estadisticas["por_departamento"][row[0]] = row[1]
        
        # Quejas por clasificación
        cursor.execute("""
            SELECT clasificacion, COUNT(*) as cantidad
            FROM quejas
            GROUP BY clasificacion
            ORDER BY cantidad DESC
        """)
        for row in cursor.fetchall():
            estadisticas["por_clasificacion"][row[0]] = row[1]
        
        # Quejas por tipo de problema
        cursor.execute("""
            SELECT problema, COUNT(*) as cantidad
            FROM quejas
            GROUP BY problema
            ORDER BY cantidad DESC
            LIMIT 10
        """)
        for row in cursor.fetchall():
            estadisticas["por_problema"][row[0]] = row[1]
        
        # Quejas recientes (últimos 30 días)
        cursor.execute("""
            SELECT COUNT(*) FROM quejas
            WHERE fecha >= NOW() - INTERVAL '30 days'
        """)
        estadisticas["quejas_recientes"] = cursor.fetchone()[0]
        
        return estadisticas
    except Exception as e:
        print(f"❌ Error al generar estadísticas: {e}")
        return estadisticas
    finally:
        conn.close()