// Content filtering system ported from Python filtro_quejas.py
export interface FilterResult {
  isAppropriate: boolean;
  correctedText?: string;
  reasons: string[];
}

class ContentFilter {
  private offensiveWords = [
    "idiota", "estúpido", "estupido", "imbécil", "imbecil", "tonto",
    "inútil", "inutil", "incompetente", "basura", "maldito", "maldita",
    "pendejo", "pendeja", "hijo de", "hijode", "marica", "maricas", "maricón", "maricon",
    "puta", "puto", "putita", "putilla", "cabron", "cabrón", "gonorrea", "gonorreita",
    "huevo", "chupa", "chupapija", "chupamedias", "chupaverga", "carajo", "culo", "culero",
    "culera", "culicagado", "culicagada", "malpa", "hdpt", "hp", "hpta", "hijueputa",
    "mamaguevo", "mamón", "mamona", "chimba", "mierda", "mierdero", "jodido", "jodida",
    "reverendo", "inepto", "inepta", "ineptos", "ineptas", "zángano", "zángana",
    "vieja", "viejo", "viejos", "viejas", "chismosa", "chismoso", "alcahueta", "alcahuete",
    "metido", "metida", "mediquillos", "mediquillo", "mediquilla", "mediquetes",
    "perro", "perra", "animal", "bestia", "bruto", "bruta", "brutico", "burro", "burra"
  ];

  private problemPatterns = [
    {
      name: "Insultos y descalificaciones",
      patterns: [
        /\b(idiota|estúpido|imbécil|tonto|inútil|incompetente|ineficiente|mediocre)\b/gi,
        /\b(basura|porquería|escoria|inmundo|repugnante|asqueroso|desagradable)\b/gi,
        /\b(torpe|ineficaz|incapaz|ignorante|negligente|perezoso|vago|holgazán)\b/gi,
        /\b(inepto|inepta|ineptos|ineptas|inservible|inservibles|incompetencia)\b/gi
      ],
      reason: "Lenguaje descalificativo",
      replacement: "[expresión respetuosa]"
    },
    {
      name: "Obscenidades",
      patterns: [
        /\b(mierda|carajo|puta|puto|culo|joder|verga|pene|vagina|coño|mamar|follar)\b/gi,
        /\b(cagar|mear|pendejo|pendeja|cabron|cabrón|perra|zorra|ramera|prostituta)\b/gi,
        /\b(gonorrea|hijode|hijue|malpa|hdp|hdpt|hp|ptm|chch|mrk|grnd)\b/gi
      ],
      reason: "Lenguaje obsceno",
      replacement: "[lenguaje apropiado]"
    },
    {
      name: "Discriminación por género o edad",
      patterns: [
        /\b(mujer|mujeres|vieja|viejas|señora|señoras)\b.*?\b(tonta|tontas|histérica|histéricas|loca|locas)\b/gi,
        /\b(vieja|viejo|viejas|viejos)\b.*?\b(médica|médico|enfermera|enfermero|doctor|doctora)\b/gi,
        /\besa\s+\b(vieja|viejo)\b/gi,
        /\b(chismosa|chismoso|chismosas|chismosos|cotilla|cotillas)\b/gi
      ],
      reason: "Lenguaje despectivo por género o edad",
      replacement: "[referencia respetuosa]"
    },
    {
      name: "Términos despectivos hacia profesionales",
      patterns: [
        /\b(mediquillo|mediquillos|mediquilla|mediquillas|medicastro|medicastros)\b/gi,
        /\b(matasanos|matasano|curandero|charlatán|charlatana)\b/gi,
        /\b(doctorcito|doctorcitos|doctora de papel|doctorcito de turno)\b/gi
      ],
      reason: "Términos despectivos hacia profesionales médicos",
      replacement: "[referencia profesional respetuosa]"
    }
  ];

  private specificExamples = [
    {
      text: "me siento mal atendido por esa vieja medica que no sabe nada de lo que pasa inepta",
      reason: "Expresión despectiva hacia profesional médico",
      replacement: "Me siento insatisfecho con la atención recibida por parte de la profesional médica."
    },
    {
      text: "me siento mal tratado por estos mediquillos",
      reason: "Término despectivo hacia profesionales médicos",
      replacement: "No estoy satisfecho con el trato recibido por parte del personal médico."
    },
    {
      text: "esas enfermeras malas personas no se como obtienen ese titulo, se los regalaron",
      reason: "Acusación injustificada sobre competencia profesional",
      replacement: "Considero que la atención del personal de enfermería no fue adecuada."
    },
    {
      text: "no tienen humanidad lo tratan a uno como a perro",
      reason: "Comparación despectiva sobre trato recibido",
      replacement: "Considero que el trato recibido careció de calidez humana."
    }
  ];

  checkContent(text: string): FilterResult {
    const lowerText = text.toLowerCase();
    const reasons: string[] = [];
    let correctedText = text;

    // Check specific examples first
    for (const example of this.specificExamples) {
      if (lowerText.includes(example.text.toLowerCase()) || example.text.toLowerCase().includes(lowerText)) {
        reasons.push(example.reason);
        correctedText = example.replacement;
        return {
          isAppropriate: false,
          correctedText,
          reasons
        };
      }
    }

    // Check basic offensive words
    for (const word of this.offensiveWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      if (regex.test(text)) {
        reasons.push(`Palabra ofensiva: ${word}`);
      }
    }

    // Check pattern categories
    for (const category of this.problemPatterns) {
      for (const pattern of category.patterns) {
        if (pattern.test(text)) {
          if (!reasons.includes(category.reason)) {
            reasons.push(category.reason);
          }
          correctedText = text.replace(pattern, category.replacement);
        }
      }
    }

    return {
      isAppropriate: reasons.length === 0,
      correctedText: reasons.length > 0 ? correctedText : undefined,
      reasons
    };
  }
}

export const contentFilter = new ContentFilter();onst contentFilter = new ContentFilter();
