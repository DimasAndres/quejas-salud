import { Link, useLocation } from 'wouter';
import { useAuth } from '../App';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-blue-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Veeduría de Salud</h1>
          <div className="flex items-center space-x-4">
            <span>Bienvenido, {user.nombre}</span>
            <button 
              onClick={handleLogout}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Panel de Control</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/nueva-queja/primaria">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                Nueva Queja - Atención Primaria
              </h3>
              <p className="text-gray-600">
                Registra quejas sobre servicios de atención primaria en salud
              </p>
            </div>
          </Link>

          <Link href="/nueva-queja/complementaria">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Nueva Queja - Atención Complementaria
              </h3>
              <p className="text-gray-600">
                Registra quejas sobre servicios complementarios de salud
              </p>
            </div>
          </Link>

          <Link href="/mis-quejas">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">
                Mis Quejas
              </h3>
              <p className="text-gray-600">
                Consulta el estado de tus quejas registradas
              </p>
            </div>
          </Link>

          <Link href="/veedores">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold text-orange-700 mb-3">
                Veedores
              </h3>
              <p className="text-gray-600">
                Información sobre los veedores del sistema de salud
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Usuario</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nombre:</span> {user.nombre} {user.apellido}
            </div>
            <div>
              <span className="font-medium">Cédula:</span> {user.cedula}
            </div>
            <div>
              <span className="font-medium">Tipo:</span> {user.tipoUsuario}
            </div>
            <div>
              <span className="font-medium">Correo:</span> {user.correo}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}