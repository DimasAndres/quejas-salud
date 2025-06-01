// Filtro de contenido basado en el código Python original
export interface ResultadoFiltro {
  esValido: boolean;
  razonesRechazo: string[];
  textoCorregido?: string;
}

const palabrasInapropiadas = [
  // Palabras ofensivas básicas
  "estúpido", "idiota", "imbécil", "pendejo", "cabrón", "maldito",
  // Discriminación
  "negro", "negra", "indio", "india", "gamín", "ñero",
  // Misoginia
  "perra", "zorra", "puta", "prostituta",
  // Palabras de odio
  "marica", "maricón", "gay", "lesbiana",
  // Violencia
  "matar", "morir", "asesino", "violencia"
];

const patronesOfensivos = [
  /\bmaldito[as]?\b/gi,
  /\bestúpid[oa]s?\b/gi,
  /\bidiota[s]?\b/gi,
  /\bimbécil[es]?\b/gi,
  /\bpendej[oa]s?\b/gi,
  /\bcabr[óo]n[es]?\b/gi
];

export function filtrarContenido(texto: string): ResultadoFiltro {
  const textoLimpio = texto.toLowerCase().trim();
  const razonesRechazo: string[] = [];
  
  // Verificar palabras específicas
  for (const palabra of palabrasInapropiadas) {
    if (textoLimpio.includes(palabra.toLowerCase())) {
      razonesRechazo.push(`Contiene lenguaje inapropiado: "${palabra}"`);
    }
  }
  
  // Verificar patrones
  for (const patron of patronesOfensivos) {
    if (patron.test(texto)) {
      razonesRechazo.push("Contiene expresiones ofensivas");
      break;
    }
  }
  
  // Si hay problemas, intentar generar versión corregida
  let textoCorregido = texto;
  if (razonesRechazo.length > 0) {
    // Reemplazar palabras problemáticas
    for (const palabra of palabrasInapropiadas) {
      const regex = new RegExp(`\\b${palabra}\\b`, 'gi');
      textoCorregido = textoCorregido.replace(regex, '[palabra censurada]');
    }
    
    // Aplicar patrones de corrección
    for (const patron of patronesOfensivos) {
      textoCorregido = textoCorregido.replace(patron, '[expresión censurada]');
    }
  }
  
  return {
    esValido: razonesRechazo.length === 0,
    razonesRechazo,
    textoCorregido: razonesRechazo.length > 0 ? textoCorregido : undefined
  };
}