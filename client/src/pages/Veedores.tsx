import { Link } from 'wouter';

export default function Veedores() {
  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-blue-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Veeduría de Salud</h1>
          <Link href="/">
            <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
              Volver al Inicio
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Veedores del Sistema de Salud</h2>
        
        <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            ¿Qué es la Veeduría de Salud?
          </h3>
          <p className="text-gray-700 mb-4">
            La Veeduría Nacional de Salud es una entidad que promueve la participación ciudadana 
            en el control social del sistema de salud colombiano, garantizando el derecho fundamental 
            a la salud y mejorando la calidad de los servicios.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-green-700 mb-3">Veeduría Nacional</h4>
            <p className="text-gray-600 mb-4">
              Coordina y supervisa las actividades de veeduría a nivel nacional
            </p>
            <div className="text-sm text-gray-500">
              <p><strong>Contacto:</strong> info@veeduriasalud.gov.co</p>
              <p><strong>Teléfono:</strong> (601) 234-5678</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-blue-700 mb-3">Veeduría Regional Andina</h4>
            <p className="text-gray-600 mb-4">
              Cobertura: Bogotá, Cundinamarca, Boyacá, Santander, Norte de Santander
            </p>
            <div className="text-sm text-gray-500">
              <p><strong>Contacto:</strong> andina@veeduriasalud.gov.co</p>
              <p><strong>Teléfono:</strong> (601) 345-6789</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-orange-700 mb-3">Veeduría Regional Caribe</h4>
            <p className="text-gray-600 mb-4">
              Cobertura: Atlántico, Bolívar, Magdalena, Cesar, La Guajira, Córdoba, Sucre
            </p>
            <div className="text-sm text-gray-500">
              <p><strong>Contacto:</strong> caribe@veeduriasalud.gov.co</p>
              <p><strong>Teléfono:</strong> (605) 456-7890</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-purple-700 mb-3">Veeduría Regional Pacífico</h4>
            <p className="text-gray-600 mb-4">
              Cobertura: Valle del Cauca, Cauca, Nariño, Chocó
            </p>
            <div className="text-sm text-gray-500">
              <p><strong>Contacto:</strong> pacifico@veeduriasalud.gov.co</p>
              <p><strong>Teléfono:</strong> (602) 567-8901</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-red-700 mb-3">Veeduría Regional Orinoquia</h4>
            <p className="text-gray-600 mb-4">
              Cobertura: Meta, Casanare, Arauca, Vichada, Guainía, Guaviare
            </p>
            <div className="text-sm text-gray-500">
              <p><strong>Contacto:</strong> orinoquia@veeduriasalud.gov.co</p>
              <p><strong>Teléfono:</strong> (608) 678-9012</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-teal-700 mb-3">Veeduría Regional Amazonia</h4>
            <p className="text-gray-600 mb-4">
              Cobertura: Amazonas, Caquetá, Putumayo, Vaupés
            </p>
            <div className="text-sm text-gray-500">
              <p><strong>Contacto:</strong> amazonia@veeduriasalud.gov.co</p>
              <p><strong>Teléfono:</strong> (608) 789-0123</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg mt-8">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            Funciones de los Veedores
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Vigilar la prestación de servicios de salud</li>
            <li>Recibir y gestionar quejas ciudadanas</li>
            <li>Promover la participación comunitaria</li>
            <li>Realizar seguimiento a políticas públicas de salud</li>
            <li>Generar informes y recomendaciones</li>
            <li>Facilitar el diálogo entre ciudadanos e instituciones</li>
          </ul>
        </div>

        <div className="bg-blue-100 p-6 rounded-lg mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            ¿Necesita registrar una queja?
          </h3>
          <p className="text-blue-700 mb-4">
            Si tiene algún problema con servicios de salud, puede registrar su queja 
            en nuestro sistema para que sea atendida por el veedor correspondiente.
          </p>
          <Link href="/register">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-4">
              Registrarse
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}