# quejas_salud/mobile/backend/mobile_api.py

from core import auth, quejas, departamentos_colombia, tipos_primaria, tipos_complementaria
import sys
import os
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import json


# Agregar el directorio padre al path para importar módulos existentes
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core import auth, quejas, departamentos_colombia, tipos_primaria, tipos_complementaria
from core.politica_datos import POLITICA_TRATAMIENTO_DATOS

app = Flask(__name__)
CORS(app)  # Habilitar CORS para peticiones desde móviles

# Configuración
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Extraer datos del request
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        cedula = data.get('cedula')
        celular = data.get('celular')
        correo = data.get('correo')
        clave = data.get('clave')
        tipo_usuario = data.get('tipo_usuario')
        acepta_politica = data.get('acepta_politica', False)
        
        # Registrar usuario usando el módulo existente
        success, message = auth.registrar_usuario(
            nombre, apellido, cedula, celular, clave, tipo_usuario, correo, acepta_politica
        )
        
        if success:
            return jsonify({'success': True, 'message': message}), 200
        else:
            return jsonify({'success': False, 'error': message}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        cedula = data.get('cedula')
        clave = data.get('clave')
        
        # Autenticar usuario
        user_id, message = auth.login_usuario(cedula, clave)
        
        if user_id:
            # Obtener información completa del usuario
            user_info = auth.obtener_info_usuario(user_id)
            if user_info:
                # Generar token simple (en producción usar JWT)
                token = f"token_{user_id}_{cedula}"
                
                return jsonify({
                    'success': True,
                    'user': {
                        'id': user_id,
                        'nombre': user_info['nombre'],
                        'apellido': user_info['apellido'],
                        'cedula': user_info['cedula'],
                        'tipo_usuario': user_info['tipo_usuario']
                    },
                    'token': token
                }), 200
            else:
                return jsonify({'success': False, 'error': 'Error obteniendo datos del usuario'}), 500
        else:
            return jsonify({'success': False, 'error': message}), 401
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/check-policy/<int:user_id>', methods=['GET'])
def check_policy(user_id):
    try:
        ha_aceptado, fecha_aceptacion = auth.verificar_politica_usuario(user_id)
        
        return jsonify({
            'success': True,
            'acepto_politica': ha_aceptado,
            'fecha_aceptacion': fecha_aceptacion.isoformat() if fecha_aceptacion else None
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/update-policy', methods=['POST'])
def update_policy():
    try:
        data = request.json
        user_id = data.get('user_id')
        accepts = data.get('accepts', True)
        
        success, message = auth.actualizar_aceptacion_politica(user_id, accepts)
        
        return jsonify({'success': success, 'message': message}), 200 if success else 400
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/user-info/<int:user_id>', methods=['GET'])
def get_user_info(user_id):
    try:
        user_info = auth.obtener_info_usuario(user_id)
        
        if user_info:
            return jsonify({
                'success': True,
                'user': {
                    'nombre': user_info['nombre'],
                    'apellido': user_info['apellido'],
                    'cedula': user_info['cedula'],
                    'correo': user_info['correo'],
                    'tipo_usuario': user_info['tipo_usuario'],
                    'acepto_politica': user_info['acepto_politica'],
                    'fecha_aceptacion': user_info['fecha_aceptacion'].isoformat() if user_info['fecha_aceptacion'] else None
                }
            }), 200
        else:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/delete-user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        success, message = auth.eliminar_usuario(user_id)
        
        return jsonify({'success': success, 'message': message}), 200 if success else 400
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/tipos-quejas/<clasificacion>', methods=['GET'])
def get_tipos_quejas(clasificacion):
    try:
        if clasificacion == 'Primaria':
            tipos = tipos_primaria.TIPOS_PRIMARIA
        elif clasificacion == 'Complementaria':
            tipos = tipos_complementaria.TIPOS_COMPLEMENTARIA
        else:
            return jsonify({'success': False, 'error': 'Clasificación inválida'}), 400
        
        return jsonify({'success': True, 'tipos': tipos}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/departamentos', methods=['GET'])
def get_departamentos():
    try:
        departamentos = list(departamentos_colombia.DEPARTAMENTOS.keys())
        return jsonify({'success': True, 'departamentos': departamentos}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/municipios/<departamento>', methods=['GET'])
def get_municipios(departamento):
    try:
        municipios = departamentos_colombia.DEPARTAMENTOS.get(departamento, [])
        return jsonify({'success': True, 'municipios': municipios}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/registrar-queja', methods=['POST'])
def registrar_queja():
    try:
        # Obtener datos del formulario
        data = request.form.to_dict()
        
        # Manejar archivos adjuntos
        archivos = []
        for key in request.files:
            if key.startswith('archivo_'):
                archivo = request.files[key]
                if archivo.filename:
                    archivos.append(archivo)
        
        # Registrar queja usando el módulo existente
        success, message = quejas.registrar_queja(
            usuario_id=int(data['usuario_id']),
            tipo_queja=data['tipo_queja'],
            clasificacion=data['clasificacion'],
            departamento=data['departamento'],
            municipio=data['municipio'],
            detalle=data['detalle'],
            para_beneficiario=data.get('para_beneficiario') == 'true',
            archivos_soporte=archivos
        )
        
        return jsonify({'success': success, 'message': message}), 200 if success else 400
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/veedores', methods=['GET'])
def get_veedores():
    try:
        # Lista estática de veedores (puedes mover esto a la base de datos)
        veedores = [
            {
                'nombre': 'Juan Pérez',
                'cargo': 'Veedor Regional Antioquia',
                'telefono': '(4) 123-4567'
            },
            {
                'nombre': 'María González',
                'cargo': 'Veedora Nacional',
                'telefono': '(1) 234-5678'
            },
            {
                'nombre': 'Carlos Rodríguez',
                'cargo': 'Veedor Regional Valle del Cauca',
                'telefono': '(2) 345-6789'
            },
            {
                'nombre': 'Ana Martínez',
                'cargo': 'Veedora Regional Atlántico',
                'telefono': '(5) 456-7890'
            },
            {
                'nombre': 'Luis Hernández',
                'cargo': 'Veedor Regional Cundinamarca',
                'telefono': '(1) 567-8901'
            }
        ]
        
        return jsonify({'success': True, 'veedores': veedores}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/politica-datos', methods=['GET'])
def get_politica_datos():
    try:
        return jsonify({
            'success': True,
            'politica': POLITICA_TRATAMIENTO_DATOS
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Ruta de salud para verificar que la API está funcionando
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'API móvil funcionando correctamente'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)