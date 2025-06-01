# consulta_simple.py
from db.connection import obtener_conexion

def ejecutar_consulta(consulta):
    conn = obtener_conexion()
    cursor = conn.cursor()
    
    try:
        cursor.execute(consulta)
        resultados = cursor.fetchall()
        
        # Intentar obtener nombres de columnas si es un SELECT
        nombres_columnas = []
        if cursor.description:
            nombres_columnas = [desc[0] for desc in cursor.description]
            print(" | ".join(nombres_columnas))
            print("-" * 80)
        
        # Mostrar resultados
        for fila in resultados:
            print(" | ".join(str(valor) for valor in fila))
        
        print(f"\nTotal de filas: {len(resultados)}")
        
    except Exception as e:
        print(f"Error al ejecutar consulta: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    consulta = input("Ingrese la consulta SQL: ")
    ejecutar_consulta(consulta)