# core/auth.py

import bcrypt
import datetime
from db.connection import obtener_conexion

def registrar_usuario(nombre, apellido, cedula, celular, clave, tipo_usuario, correo, acepta_politica=False):
    """
    Registra un nuevo usuario en el sistema incluyendo la aceptación de política de datos
    
    Args:
        nombre: Nombre del usuario
        apellido: Apellido del usuario
        cedula: Número de cédula del usuario
        celular: Número de celular del usuario
        clave: Contraseña del usuario
        tipo_usuario: Tipo de usuario (docente, pensionado, beneficiario)
        correo: Correo electrónico del usuario
        acepta_politica: Boolean indicando si el usuario aceptó la política de tratamiento de datos
        
    Returns:
        tuple: (éxito, mensaje)
    """
    # Validar que se haya aceptado la política
    if not acepta_politica:
        return False, "Debe aceptar la política de tratamiento de datos para registrarse."
    
    # Generar hash seguro con bcrypt
    clave_hashed = bcrypt.hashpw(clave.encode('utf-8'), bcrypt.gensalt())
    
    conn = obtener_conexion()
    cursor = conn.cursor()
    try:
        # Preparar fecha de aceptación
        fecha_aceptacion = datetime.datetime.now()
        
        # Insertar usuario con campos de política de datos
        cursor.execute(
            "INSERT INTO usuarios (nombre, apellido, cedula, celular, clave, tipo_usuario, correo, acepto_politica, fecha_aceptacion) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (nombre, apellido, cedula, celular, clave_hashed.decode('utf-8'), tipo_usuario, correo, 
             acepta_politica, fecha_aceptacion)
        )
        conn.commit()
        return True, "Usuario registrado con éxito."
    except Exception as e:
        conn.rollback()
        if "duplicate" in str(e).lower():
            return False, "Ya existe un usuario con esa cédula."
        return False, f"Error: {e}"
    finally:
        conn.close()

def login_usuario(cedula, clave):
    """
    Autentica un usuario en el sistema y verifica que haya aceptado la política de datos
    
    Args:
        cedula: Número de cédula del usuario
        clave: Contraseña del usuario
        
    Returns:
        tuple: (usuario_id o None, mensaje)
    """
    conn = obtener_conexion()
    cursor = conn.cursor()
    try:
        # Consultar usuario incluyendo información de política de datos
        cursor.execute(
            "SELECT id, clave, acepto_politica, fecha_aceptacion FROM usuarios WHERE cedula=%s", 
            (cedula,)
        )
        usuario = cursor.fetchone()
        
        if not usuario:
            return None, "Usuario no encontrado"
        
        usuario_id, clave_bd, acepto_politica, fecha_aceptacion = usuario
        
        # Verificar hash de forma segura
        try:
            if not bcrypt.checkpw(clave.encode('utf-8'), clave_bd.encode('utf-8')):
                return None, "Contraseña incorrecta"
        except ValueError as e:
            print(f"Error al verificar hash: {e}")
            return None, "Error en el sistema de autenticación"
        
        # Verificar que el usuario haya aceptado la política de datos
        if not acepto_politica:
            return None, "Debe aceptar la política de tratamiento de datos para acceder al sistema. Contacte al administrador."
        
        return usuario_id, "Inicio de sesión exitoso."
            
    except Exception as e:
        print(f"Error en login: {e}")
        return None, "Error al procesar la solicitud"
    finally:
        conn.close()

def verificar_politica_usuario(usuario_id):
    """
    Verifica si un usuario ha aceptado la política de tratamiento de datos
    
    Args:
        usuario_id: ID del usuario a verificar
        
    Returns:
        tuple: (ha_aceptado, fecha_aceptacion)
    """
    conn = obtener_conexion()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT acepto_politica, fecha_aceptacion FROM usuarios WHERE id=%s", 
            (usuario_id,)
        )
        resultado = cursor.fetchone()
        
        if not resultado:
            return False, None
            
        acepto_politica, fecha_aceptacion = resultado
        return acepto_politica, fecha_aceptacion
        
    except Exception as e:
        print(f"Error al verificar política: {e}")
        return False, None
    finally:
        conn.close()

def actualizar_aceptacion_politica(usuario_id, acepta=True):
    """
    Actualiza el estado de aceptación de la política para un usuario existente
    
    Args:
        usuario_id: ID del usuario
        acepta: Boolean indicando si acepta la política
        
    Returns:
        tuple: (éxito, mensaje)
    """
    conn = obtener_conexion()
    cursor = conn.cursor()
    try:
        fecha_aceptacion = datetime.datetime.now() if acepta else None
        
        cursor.execute(
            "UPDATE usuarios SET acepto_politica=%s, fecha_aceptacion=%s WHERE id=%s",
            (acepta, fecha_aceptacion, usuario_id)
        )
        conn.commit()
        
        if acepta:
            return True, "Política de datos aceptada correctamente."
        else:
            return True, "Aceptación de política revocada."
            
    except Exception as e:
        conn.rollback()
        print(f"Error al actualizar política: {e}")
        return False, f"Error al actualizar política: {e}"
    finally:
        conn.close()

def eliminar_usuario(usuario_id):
    """
    Elimina un usuario y todos sus datos asociados (para revocación de consentimiento)
    
    Args:
        usuario_id: ID del usuario a eliminar
        
    Returns:
        tuple: (éxito, mensaje)
    """
    conn = obtener_conexion()
    cursor = conn.cursor()
    try:
        # Primero eliminar quejas relacionadas (por restricción de clave foránea)
        cursor.execute("DELETE FROM quejas WHERE usuario_id = %s", (usuario_id,))
        
        # Luego eliminar el usuario
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (usuario_id,))
        
        conn.commit()
        return True, "Usuario y datos asociados eliminados correctamente."
    except Exception as e:
        conn.rollback()
        print(f"Error al eliminar usuario: {e}")
        return False, f"Error al eliminar usuario: {e}"
    finally:
        conn.close()

def obtener_info_usuario(usuario_id):
    """
    Obtiene información básica de un usuario
    
    Args:
        usuario_id: ID del usuario
        
    Returns:
        dict: Información del usuario o None si no existe
    """
    conn = obtener_conexion()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT nombre, apellido, cedula, correo, tipo_usuario, acepto_politica, fecha_aceptacion "
            "FROM usuarios WHERE id=%s", 
            (usuario_id,)
        )
        resultado = cursor.fetchone()
        
        if not resultado:
            return None
            
        nombre, apellido, cedula, correo, tipo_usuario, acepto_politica, fecha_aceptacion = resultado
        
        return {
            'nombre': nombre,
            'apellido': apellido,
            'cedula': cedula,
            'correo': correo,
            'tipo_usuario': tipo_usuario,
            'acepto_politica': acepto_politica,
            'fecha_aceptacion': fecha_aceptacion
        }
        
    except Exception as e:
        print(f"Error al obtener información del usuario: {e}")
        return None
    finally:
        conn.close()