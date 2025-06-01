import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useAuth } from '../App';

export default function ComplaintForm() {
  const { tipo } = useParams();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    problema: '',
    detalle: '',
    ciudad: '',
    departamento: '',
    correo: user?.correo || '',
    clasificacion: tipo || '',
    soporte: '',
    paraBeneficiario: false,
    usuarioId: user?.id || 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch departamentos
  const { data: departamentosData } = useQuery({
    queryKey: ['/api/departamentos'],
    queryFn: () => apiRequest('/api/departamentos')
  });

  // Fetch tipos de queja
  const { data: tiposData } = useQuery({
    queryKey: ['/api/tipos-queja', tipo],
    queryFn: () => apiRequest(`/api/tipos-queja/${tipo}`),
    enabled: !!tipo
  });

  const complainMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('/api/quejas', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      setSuccess('Queja registrada exitosamente');
      setTimeout(() => setLocation('/mis-quejas'), 2000);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  if (!user) {
    setLocation('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    complainMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const tipoTitle = tipo === 'primaria' ? 'Atención Primaria' : 'Atención Complementaria';

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

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          Nueva Queja - {tipoTitle}
        </h2>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Problema *
            </label>
            <select
              name="problema"
              value={formData.problema}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione el tipo de problema</option>
              {tiposData?.tipos?.map((tipo: string) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción Detallada *
            </label>
            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describa detalladamente el problema o queja que desea reportar..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione departamento</option>
                {departamentosData?.departamentos?.map((dept: string) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo de Contacto *
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
              Documentos de Soporte (opcional)
            </label>
            <input
              type="text"
              name="soporte"
              value={formData.soporte}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describa los documentos que tiene como evidencia"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="paraBeneficiario"
              checked={formData.paraBeneficiario}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">
              Esta queja es en representación de un beneficiario
            </label>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={complainMutation.isPending}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {complainMutation.isPending ? 'Registrando...' : 'Registrar Queja'}
            </button>
            
            <Link href="/dashboard">
              <button 
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}