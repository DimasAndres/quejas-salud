# core/acciones_quejas.py
from db.connection import obtener_conexion

def editar_queja(id_queja, usuario_id, problema, detalle, ciudad, departamento, correo):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE quejas
        SET problema = %s,
            detalle = %s,
            ciudad = %s,
            departamento = %s,
            correo = %s
        WHERE id = %s AND usuario_id = %s
    """, (problema, detalle, ciudad, departamento, correo, id_queja, usuario_id))
    conn.commit()
    conn.close()
    return "✏️ Queja actualizada correctamente."

def eliminar_queja(id_queja, usuario_id):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute("""
        DELETE FROM quejas
        WHERE id = %s AND usuario_id = %s
    """, (id_queja, usuario_id))
    conn.commit()
    conn.close()
    return "🗑️ Queja eliminada correctamente."

def obtener_quejas_detalladas(usuario_id):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, problema, detalle, ciudad, departamento, correo, fecha
        FROM quejas
        WHERE usuario_id = %s
        ORDER BY fecha DESC
    """, (usuario_id,))
    resultados = cursor.fetchall()
    conn.close()
    return resultados
