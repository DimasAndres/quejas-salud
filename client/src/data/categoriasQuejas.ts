// Estructura jerárquica de categorías y subcategorías de quejas de salud para el magisterio colombiano
export interface SubCategoria {
  id: string;
  nombre: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  subcategorias: SubCategoria[];
}

export const CATEGORIAS_QUEJAS: Categoria[] = [
  {
    id: "acceso-servicios",
    nombre: "Acceso a Servicios de Salud",
    subcategorias: [
      { id: "asignacion-citas", nombre: "Demora en asignación de citas con médicos generales" },
      { id: "citas-especialistas", nombre: "Demora en asignación de citas con especialistas" },
      { id: "cancelacion-citas", nombre: "Cancelación de citas sin previo aviso" },
      { id: "negacion-citas", nombre: "Negación de citas médicas" },
      { id: "problemas-agendamiento", nombre: "Problemas con el sistema de agendamiento" },
      { id: "demora-urgencias", nombre: "Demora en la atención de urgencias" },
      { id: "negacion-urgencias", nombre: "Negación del servicio de urgencias" },
      { id: "triage-inadecuado", nombre: "Clasificación inadecuada del triage" },
      { id: "demora-remisiones", nombre: "Demora en remisiones a especialistas" },
      { id: "negacion-remisiones", nombre: "Negación de remisiones" },
      { id: "cobertura-geografica", nombre: "Problemas de cobertura geográfica" }
    ]
  },
  {
    id: "medicamentos-tratamientos",
    nombre: "Medicamentos y Tratamientos",
    subcategorias: [
      { id: "negacion-medicamentos", nombre: "Negación en la entrega de medicamentos" },
      { id: "entrega-incompleta", nombre: "Entrega incompleta de medicamentos" },
      { id: "demora-entrega", nombre: "Demora en la entrega de medicamentos" },
      { id: "medicamentos-mal-estado", nombre: "Entrega de medicamentos vencidos o en mal estado" },
      { id: "sustitucion-no-autorizada", nombre: "Sustitución no autorizada de medicamentos" },
      { id: "negacion-alto-costo", nombre: "Negación de medicamentos de alto costo" },
      { id: "demora-autorizacion", nombre: "Demora en la autorización de medicamentos de alto costo" },
      { id: "interrupcion-tratamientos", nombre: "Interrupción de tratamientos en curso" }
    ]
  },
  {
    id: "procedimientos-medicos",
    nombre: "Procedimientos Médicos y Quirúrgicos",
    subcategorias: [
      { id: "aplazamiento-cirugias", nombre: "Aplazamiento de cirugías programadas" },
      { id: "cancelacion-cirugias", nombre: "Cancelación de cirugías sin justificación" },
      { id: "negacion-procedimientos", nombre: "Negación de procedimientos quirúrgicos" },
      { id: "complicaciones-sin-atencion", nombre: "Complicaciones postquirúrgicas sin atención adecuada" },
      { id: "demora-examenes", nombre: "Demora en la realización de exámenes diagnósticos" },
      { id: "negacion-examenes", nombre: "Negación de exámenes diagnósticos" },
      { id: "perdida-resultados", nombre: "Pérdida de resultados de exámenes" },
      { id: "errores-resultados", nombre: "Errores en resultados de exámenes" },
      { id: "negacion-terapias", nombre: "Negación de terapias" },
      { id: "sesiones-insuficientes", nombre: "Número insuficiente de sesiones terapéuticas" }
    ]
  },
  {
    id: "calidad-atencion",
    nombre: "Calidad de la Atención",
    subcategorias: [
      { id: "maltrato-verbal", nombre: "Maltrato verbal por parte del personal" },
      { id: "discriminacion", nombre: "Discriminación en la atención" },
      { id: "falta-informacion", nombre: "Falta de información clara al paciente" },
      { id: "vulneracion-privacidad", nombre: "Vulneración de la privacidad del paciente" },
      { id: "tiempo-insuficiente", nombre: "Consultas médicas con tiempo insuficiente" },
      { id: "demora-sala-espera", nombre: "Demora en sala de espera excesiva" },
      { id: "incumplimiento-horarios", nombre: "Incumplimiento de horarios programados" },
      { id: "diagnosticos-erroneos", nombre: "Diagnósticos erróneos o imprecisos" },
      { id: "tratamientos-inadecuados", nombre: "Tratamientos inadecuados" },
      { id: "negligencia-medica", nombre: "Negligencia médica" }
    ]
  },
  {
    id: "salud-mental",
    nombre: "Salud Mental",
    subcategorias: [
      { id: "negacion-atencion-psicologica", nombre: "Negación de atención psicológica" },
      { id: "demora-citas-psicologia", nombre: "Demora en asignación de citas con psicología/psiquiatría" },
      { id: "falta-programas-prevencion", nombre: "Falta de programas de prevención en salud mental" },
      { id: "negacion-medicamentos-psiquiatricos", nombre: "Negación de medicamentos psiquiátricos" },
      { id: "interrupcion-tratamientos-mentales", nombre: "Interrupción de tratamientos psicológicos/psiquiátricos" },
      { id: "falta-seguimiento-trastornos", nombre: "Falta de seguimiento a pacientes con trastornos mentales" },
      { id: "burnout", nombre: "Síndrome de burnout (agotamiento profesional)" },
      { id: "estres-laboral", nombre: "Estrés laboral" },
      { id: "ansiedad-trabajo", nombre: "Ansiedad relacionada con el trabajo" },
      { id: "depresion", nombre: "Depresión" }
    ]
  },
  {
    id: "enfermedades-laborales",
    nombre: "Enfermedades Laborales y Salud Ocupacional",
    subcategorias: [
      { id: "demora-calificacion", nombre: "Demora en la calificación de origen de enfermedad" },
      { id: "negacion-origen-laboral", nombre: "Negación del origen laboral de enfermedades" },
      { id: "desacuerdo-porcentaje", nombre: "Desacuerdo con porcentaje de pérdida de capacidad laboral" },
      { id: "falta-seguimiento-laboral", nombre: "Falta de seguimiento a enfermedades laborales" },
      { id: "problemas-voz", nombre: "Problemas de voz y garganta (disfonía)" },
      { id: "tunel-carpiano", nombre: "Síndrome del túnel del carpo" },
      { id: "problemas-osteomusculares", nombre: "Problemas osteomusculares" },
      { id: "varices", nombre: "Várices y problemas circulatorios" },
      { id: "ausencia-programas-prevencion", nombre: "Ausencia de programas de prevención de riesgos laborales" },
      { id: "falta-capacitacion", nombre: "Falta de capacitación en salud ocupacional" }
    ]
  },
  {
    id: "tramites-administrativos",
    nombre: "Trámites Administrativos",
    subcategorias: [
      { id: "demora-autorizaciones", nombre: "Demora en emisión de autorizaciones" },
      { id: "negacion-autorizaciones", nombre: "Negación injustificada de autorizaciones" },
      { id: "perdida-solicitudes", nombre: "Pérdida de solicitudes de autorización" },
      { id: "exceso-tramites", nombre: "Exceso de trámites para obtener autorizaciones" },
      { id: "problemas-afiliacion", nombre: "Problemas en la afiliación de beneficiarios" },
      { id: "demora-actualizacion", nombre: "Demora en actualización de datos" },
      { id: "errores-informacion", nombre: "Errores en la información de afiliación" },
      { id: "negacion-incapacidades", nombre: "Negación de incapacidades" },
      { id: "reduccion-dias", nombre: "Reducción injustificada de días de incapacidad" },
      { id: "problemas-pago", nombre: "Problemas con el pago de incapacidades" }
    ]
  },
  {
    id: "transporte-desplazamiento",
    nombre: "Transporte y Desplazamiento",
    subcategorias: [
      { id: "negacion-transporte", nombre: "Negación de servicio de transporte" },
      { id: "demora-asignacion-transporte", nombre: "Demora en la asignación de transporte" },
      { id: "condiciones-inadecuadas", nombre: "Condiciones inadecuadas de los vehículos" },
      { id: "falta-reconocimiento-gastos", nombre: "Falta de reconocimiento de gastos de transporte" },
      { id: "demora-reembolso", nombre: "Demora en el reembolso de gastos" },
      { id: "costos-excesivos", nombre: "Costos excesivos de desplazamiento a otros municipios" }
    ]
  },
  {
    id: "enfermedades-alto-costo",
    nombre: "Atención a Enfermedades de Alto Costo",
    subcategorias: [
      { id: "demora-diagnostico-cancer", nombre: "Demora en diagnóstico de cáncer" },
      { id: "interrupcion-tratamientos-oncologicos", nombre: "Interrupción de tratamientos oncológicos" },
      { id: "falta-acceso-medicamentos-oncologicos", nombre: "Falta de acceso a medicamentos oncológicos" },
      { id: "ausencia-deteccion-temprana", nombre: "Ausencia de programas de detección temprana" },
      { id: "demora-emergencias-cardiovasculares", nombre: "Demora en atención de emergencias cardiovasculares" },
      { id: "falta-seguimiento-cardiacos", nombre: "Falta de seguimiento a pacientes cardíacos" },
      { id: "negacion-procedimientos-cardiovasculares", nombre: "Negación de procedimientos cardiovasculares" },
      { id: "problemas-vih", nombre: "Problemas en atención de VIH/SIDA" },
      { id: "problemas-renales", nombre: "Problemas en atención de enfermedades renales crónicas" },
      { id: "problemas-autoinmunes", nombre: "Problemas en atención de enfermedades autoinmunes" }
    ]
  },
  {
    id: "infraestructura-recursos",
    nombre: "Infraestructura y Recursos",
    subcategorias: [
      { id: "instalaciones-mal-estado", nombre: "Instalaciones en mal estado" },
      { id: "falta-accesibilidad", nombre: "Falta de accesibilidad para personas con movilidad reducida" },
      { id: "condiciones-higiene", nombre: "Condiciones de higiene deficientes" },
      { id: "equipos-obsoletos", nombre: "Equipos médicos obsoletos o en mal estado" },
      { id: "falta-equipos", nombre: "Falta de equipos especializados" },
      { id: "demora-mantenimiento", nombre: "Demora en mantenimiento de equipos" },
      { id: "insuficiente-personal", nombre: "Insuficiente personal médico" },
      { id: "falta-especialistas", nombre: "Falta de especialistas en la red" },
      { id: "alta-rotacion", nombre: "Alta rotación del personal médico" }
    ]
  }
];
