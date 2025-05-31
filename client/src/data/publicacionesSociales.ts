// Datos de ejemplo para trinos y publicaciones de redes sociales de la veeduría
export interface PublicacionSocial {
  id: string;
  contenido: string;
  fecha: string;
  autor: string;
  plataforma: 'twitter' | 'facebook' | 'instagram';
  likes: number;
  compartidos: number;
  imagen?: string;
  url: string;
}

export const PUBLICACIONES_SOCIALES: PublicacionSocial[] = [
  {
    id: "pub-001",
    contenido: "🚨 Atención docentes: Hemos detectado demoras significativas en la asignación de citas con especialistas en varias regiones. Estamos recopilando casos para presentar un informe consolidado. #SaludMagisterio #VeeduríaDocente",
    fecha: "2024-05-28T14:30:00",
    autor: "Veeduría Salud Magisterio",
    plataforma: "twitter",
    likes: 145,
    compartidos: 87,
    url: "https://twitter.com/veeduria_salud/status/1234567890"
  },
  {
    id: "pub-002",
    contenido: "📢 Comunicado oficial: La veeduría en salud del magisterio rechaza categóricamente la entrega de medicamentos genéricos sin previa consulta con los especialistas tratantes. Exigimos respeto por los derechos de los docentes.",
    fecha: "2024-05-25T10:15:00",
    autor: "Veeduría Salud Magisterio",
    plataforma: "facebook",
    likes: 328,
    compartidos: 156,
    imagen: "/images/medicamentos-genericos.jpg",
    url: "https://facebook.com/veeduria.salud/posts/123456789"
  },
  {
    id: "pub-003",
    contenido: "Hoy participamos en la mesa técnica con @MinEducacion y @Fiduprevisora para abordar las principales quejas sobre el nuevo modelo de salud. Seguiremos vigilantes para garantizar un servicio de calidad para todos los docentes. #CompromisoPorLaSalud",
    fecha: "2024-05-22T16:45:00",
    autor: "Veeduría Salud Magisterio",
    plataforma: "twitter",
    likes: 203,
    compartidos: 112,
    imagen: "/images/mesa-tecnica.jpg",
    url: "https://twitter.com/veeduria_salud/status/1234567891"
  },
  {
    id: "pub-004",
    contenido: "📋 Nueva guía disponible: \"Cómo presentar quejas efectivas sobre servicios de salud\". Descárgala en nuestra web y comparte con tus colegas docentes. ¡Conocer tus derechos es el primer paso para defenderlos!",
    fecha: "2024-05-20T09:30:00",
    autor: "Veeduría Salud Magisterio",
    plataforma: "facebook",
    likes: 276,
    compartidos: 198,
    url: "https://facebook.com/veeduria.salud/posts/123456790"
  },
  {
    id: "pub-005",
    contenido: "Recordamos a todos los docentes que pueden reportar problemas con la plataforma SUIM-HORUS directamente a nuestra veeduría. Estamos consolidando casos para presentar soluciones estructurales. #MejorasContinuas",
    fecha: "2024-05-18T11:20:00",
    autor: "Veeduría Salud Magisterio",
    plataforma: "twitter",
    likes: 167,
    compartidos: 89,
    url: "https://twitter.com/veeduria_salud/status/1234567892"
  },
  {
    id: "pub-006",
    contenido: "📸 Jornada de capacitación sobre derechos en salud para docentes en Bogotá. Gracias a todos los asistentes por su participación activa. Próximas fechas para otras ciudades en nuestra web. #FormacionDocente #DerechosEnSalud",
    fecha: "2024-05-15T15:10:00",
    autor: "Veeduría Salud Magisterio",
    plataforma: "instagram",
    likes: 312,
    compartidos: 45,
    imagen: "/images/capacitacion-docentes.jpg",
    url: "https://instagram.com/p/veeduria_salud/123456"
  },
  {
    id: "pub-007",
    contenido: "La Superintendencia de Salud ha impuesto medida cautelar a Fiduprevisora y FOMAG por crisis en el sistema de salud del magisterio. Seguiremos vigilantes para que se implementen soluciones reales y no solo medidas temporales.",
    fecha: "2024-05-12T13:25:00",
    autor: "Veeduría Salud Magisterio",
    plataforma: "twitter",
    likes: 421,
    compartidos: 267,
    url: "https://twitter.com/veeduria_salud/status/1234567893"
  },
  {
    id: "pub-008",
    contenido: "🔍 Análisis de las principales quejas recibidas en el primer trimestre de 2024: 1️⃣ Demora en citas con especialistas 2️⃣ Negación de medicamentos 3️⃣ Problemas con autorizaciones. Informe completo en nuestra web.",
    fecha: "2024-05-10T10:00:00",
    autor: "Veeduría Salud Magisterio",
    plataforma: "facebook",
    likes: 189,
    compartidos: 124,
    url: "https://facebook.com/veeduria.salud/posts/123456791"
  }
];
