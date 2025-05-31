import React from 'react';
import { ComplaintForm } from './pages/complaint-form';
import { DocumentosVeeduriaPanel } from './components/documentos-veeduria-panel';
import { PublicacionesSocialesPanel } from './components/publicaciones-sociales-panel';

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo para documentos */}
      <div className="hidden lg:block w-72 border-r p-4 overflow-auto">
        <DocumentosVeeduriaPanel />
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <ComplaintForm />
      </div>
      
      {/* Panel derecho para redes sociales */}
      <div className="hidden lg:block w-72 border-l p-4 overflow-auto">
        <PublicacionesSocialesPanel />
      </div>
    </div>
  );
}
