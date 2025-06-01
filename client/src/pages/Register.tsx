import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    celular: '',
    clave: '',
    confirmarClave: '',
    tipoUsuario: '',
    correo: '',
    aceptoPolitica: false
  });
  const [error, setError] = useState('');
  const [showPolicy, setShowPolicy] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      setLocation('/login');
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.clave !== formData.confirmarClave) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.aceptoPolitica) {
      setError('Debe aceptar la política de tratamiento de datos');
      return;
    }

    const { confirmarClave, ...dataToSend } = formData;
    registerMutation.mutate(dataToSend);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
            Registro de Usuario
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Cédula *
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Celular *
                </label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuario *
              </label>
              <select
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione una opción</option>
                <option value="docente">Docente</option>
                <option value="pensionado">Pensionado</option>
                <option value="beneficiario">Beneficiario</option>
              </select>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="clave"
                  value={formData.clave}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  name="confirmarClave"
                  value={formData.confirmarClave}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="aceptoPolitica"
                  checked={formData.aceptoPolitica}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-700">
                  Acepto la{' '}
                  <button
                    type="button"
                    onClick={() => setShowPolicy(!showPolicy)}
                    className="text-blue-600 hover:underline"
                  >
                    política de tratamiento de datos personales
                  </button>
                  {' '}según la Ley 1581 de 2012 *
                </span>
              </label>
              
              {showPolicy && (
                <div className="mt-3 p-3 bg-white border rounded text-xs text-gray-600 max-h-32 overflow-y-auto">
                  <p><strong>POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</strong></p>
                  <p>La Veeduría Nacional de Salud, en cumplimiento de la Ley 1581 de 2012, informa que los datos personales suministrados serán utilizados exclusivamente para:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Gestión y seguimiento de quejas del sector salud</li>
                    <li>Contacto y notificaciones sobre el estado de las quejas</li>
                    <li>Generación de estadísticas para mejora del sistema de salud</li>
                  </ul>
                  <p className="mt-2">Sus datos serán protegidos y no serán compartidos con terceros sin su autorización.</p>
                </div>
              )}
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {registerMutation.isPending ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-600 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link href="/" className="text-blue-600 hover:underline">
              Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}