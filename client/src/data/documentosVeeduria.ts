// Datos de ejemplo para documentos y escritos de la veeduría
export interface Documento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: 'informe' | 'comunicado' | 'normativa' | 'guia';
  url: string;
}

export const DOCUMENTOS_VEEDURIA: Documento[] = [
  {
    id: "doc-001",
    titulo: "Informe de gestión veeduría salud 2024",
    descripcion: "Informe anual sobre la gestión y resultados de la veeduría en salud del magisterio",
    fecha: "2024-04-15",
    tipo: "informe",
    url: "/documentos/informe-gestion-2024.pdf"
  },
  {
    id: "doc-002",
    titulo: "Comunicado oficial sobre nuevo modelo de salud",
    descripcion: "Posición de la veeduría frente al nuevo modelo de salud del magisterio",
    fecha: "2024-05-10",
    tipo: "comunicado",
    url: "/documentos/comunicado-modelo-salud.pdf"
  },
  {
    id: "doc-003",
    titulo: "Decreto 1655 de 2015",
    descripcion: "Sistema de Gestión de Seguridad y Salud en el Trabajo para docentes",
    fecha: "2015-08-20",
    tipo: "normativa",
    url: "/documentos/decreto-1655-2015.pdf"
  },
  {
    id: "doc-004",
    titulo: "Guía para presentación de quejas efectivas",
    descripcion: "Recomendaciones para presentar quejas que sean atendidas oportunamente",
    fecha: "2024-03-05",
    tipo: "guia",
    url: "/documentos/guia-quejas-efectivas.pdf"
  },
  {
    id: "doc-005",
    titulo: "Análisis de principales problemas de salud del magisterio",
    descripcion: "Estudio sobre las principales afectaciones de salud reportadas por docentes",
    fecha: "2024-02-18",
    tipo: "informe",
    url: "/documentos/analisis-problemas-salud.pdf"
  },
  {
    id: "doc-006",
    titulo: "Comunicado sobre medicamentos genéricos",
    descripcion: "Posición oficial sobre la entrega de medicamentos genéricos a docentes",
    fecha: "2024-04-28",
    tipo: "comunicado",
    url: "/documentos/comunicado-medicamentos-genericos.pdf"
  },
  {
    id: "doc-007",
    titulo: "Ley 91 de 1989",
    descripcion: "Creación del Fondo Nacional de Prestaciones Sociales del Magisterio",
    fecha: "1989-12-29",
    tipo: "normativa",
    url: "/documentos/ley-91-1989.pdf"
  },
  {
    id: "doc-008",
    titulo: "Guía de derechos en salud para docentes",
    descripcion: "Información sobre los derechos en salud del magisterio colombiano",
    fecha: "2024-01-20",
    tipo: "guia",
    url: "/documentos/guia-derechos-salud.pdf"
  }
];
