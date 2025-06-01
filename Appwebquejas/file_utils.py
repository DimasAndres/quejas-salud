# utils/file_utils.py
import os

def validar_archivos_adjuntos(lista_archivos):
    """
    Valida que los archivos adjuntos existan y sean accesibles.
    
    Args:
        lista_archivos: Lista de rutas a archivos
        
    Returns:
        tuple: (archivos_validos, archivos_invalidos)
    """
    archivos_validos = []
    archivos_invalidos = []
    
    if not lista_archivos:
        return [], []
    
    for ruta in lista_archivos:
        if os.path.isfile(ruta) and os.access(ruta, os.R_OK):
            archivos_validos.append(ruta)
        else:
            archivos_invalidos.append(ruta)
    
    return archivos_validos, archivos_invalidos