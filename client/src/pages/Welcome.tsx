import { Link } from 'wouter';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">
            Sistema de Veeduría de Salud
          </h1>
          
          <p className="text-lg text-gray-700 mb-8">
            Plataforma para la recepción y gestión de quejas del sector salud en Colombia
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">
                Para Usuarios
              </h3>
              <p className="text-gray-600 mb-4">
                Registra tus quejas sobre servicios de salud y realiza seguimiento a su estado
              </p>
              <div className="space-y-2">
                <Link href="/register">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    Registrarse
                  </button>
                </Link>
                <Link href="/login">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                    Iniciar Sesión
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Información
              </h3>
              <p className="text-gray-600 mb-4">
                Consulta información sobre veedores y el proceso de quejas
              </p>
              <Link href="/veedores">
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                  Ver Veedores
                </button>
              </Link>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Sistema desarrollado para la Veeduría Nacional de Salud</p>
            <p>Cumple con la Ley 1581 de 2012 de Protección de Datos Personales</p>
          </div>
        </div>
      </div>
    </div>
  );
}