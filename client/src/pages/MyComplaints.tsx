import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useAuth } from '../App';

export default function MyComplaints() {
  const { user } = useAuth();

  const { data: quejasData, isLoading } = useQuery({
    queryKey: ['/api/quejas/user', user?.id],
    queryFn: () => apiRequest(`/api/quejas/user/${user?.id}`),
    enabled: !!user?.id
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">Debe iniciar sesión para ver sus quejas</p>
          <Link href="/login">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'en_proceso': return 'bg-blue-100 text-blue-800';
      case 'resuelto': return 'bg-green-100 text-green-800';
      case 'cerrado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-blue-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Veeduría de Salud</h1>
          <Link href="/dashboard">
            <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
              Volver al Panel
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Mis Quejas Registradas</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando quejas...</p>
          </div>
        ) : quejasData?.quejas?.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              No tiene quejas registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Puede registrar una nueva queja desde el panel principal
            </p>
            <Link href="/dashboard">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Ir al Panel Principal
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quejasData?.quejas?.map((queja: any) => (
              <div key={queja.id} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Queja #{queja.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Registrada el {formatFecha(queja.fechaCreacion)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(queja.estado)}`}>
                    {queja.estado === 'pendiente' ? 'Pendiente' :
                     queja.estado === 'en_proceso' ? 'En Proceso' :
                     queja.estado === 'resuelto' ? 'Resuelto' : 'Cerrado'}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tipo de Problema:</p>
                    <p className="text-gray-600">{queja.problema}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Clasificación:</p>
                    <p className="text-gray-600 capitalize">{queja.clasificacion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Ubicación:</p>
                    <p className="text-gray-600">{queja.ciudad}, {queja.departamento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Para Beneficiario:</p>
                    <p className="text-gray-600">{queja.paraBeneficiario ? 'Sí' : 'No'}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Descripción:</p>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">
                    {queja.detalle}
                  </p>
                </div>
                
                {queja.soporte && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Documentos de Soporte:</p>
                    <p className="text-gray-600 text-sm">{queja.soporte}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}