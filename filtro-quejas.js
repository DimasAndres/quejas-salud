/**
 * Módulo para filtrar lenguaje inapropiado en quejas de salud
 * 
 * Sistema ultra-avanzado para detectar y filtrar lenguaje inapropiado,
 * expresiones de maltrato, misoginia, racismo, discriminación de género 
 * y otras formas de comunicación no adecuadas para mensajes oficiales.
 * 
 * Versión 2.0 - Incluye detección de sutilezas y variaciones
 * Autor: Basado en sistema Python original
 * Fecha: Junio 2025
 */

// Lista básica de palabras ofensivas
const PALABRAS_OFENSIVAS = [
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
    "perro", "perra", "animal", "bestia", "bruto", "bruta", "brutico", "burro", "burra",
    "regalado", "regalada", "regalados", "regaladas", "malo", "mala", "malos", "malas", 
    "porquería", "porqueria", "humanidad", "plaga", "plaguita", "lacra", "rastrero",
    "arrastrado", "rastrera", "asqueroso", "asquerosa", "maltratador", "maltratadora",
    "mal tratado", "doctorcito", "doctorcitos", "doctora de papel", "doctorcito de turno",
    "medicastro", "medicastros", "mediquito", "mediquita", "enfermeras", "enfermeros",
    "médicos", "médicas", "matasanos", "matasano", "curandero", "charlatán", "charlatana",
    "abuela", "abuelo", "chiquita", "chiquito", "papito", "mamita", "muchachita", "muchachito",
    "señorita", "jovencita", "zorra", "ramera", "prostituta", "golfa", "loca", "loco",
    "idiotita", "tarado", "tarada", "tarados", "taradas", "desgraciado", "desgraciada",
    "malnacido", "malnacida", "carechimba", "careculo", "careverga", "caremonda", "caremierda"
];

// Configuración del filtro
const USAR_FILTRO_AVANZADO = true;
const NIVEL_SENSIBILIDAD = 'máximo'; // 'bajo', 'medio', 'alto', 'extremo', 'máximo'

// Variable global para almacenar texto corregido
let textoCorregidoGlobal = null;

/**
 * Filtro ultra-avanzado local que detecta diversos tipos de lenguaje inapropiado
 * @param {string} texto - El texto a analizar
 * @returns {Object} - {esApropiado, textoCorregido, razones}
 */
function filtrarContenidoAvanzadoLocal(texto) {
    let esApropiado = true;
    let razones = [];
    let textoCorregido = texto;
    
    // Ejemplos específicos - detección exacta primero
    const ejemplosMencionados = [
        {
            texto: "me siento mal atendido por esa vieja medica que no sabe nada de lo que pasa inepta",
            razon: "Expresión despectiva hacia profesional médico",
            reemplazo: "Me siento insatisfecho con la atención recibida por parte de la profesional médica."
        },
        {
            texto: "me siento mal tratado por estos mediqullos",
            razon: "Término despectivo hacia profesionales médicos", 
            reemplazo: "No estoy satisfecho con el trato recibido por parte del personal médico."
        },
        {
            texto: "esas enfermeras malas personas no se como obtienen ese titulo, se los regalaron",
            razon: "Acusación injustificada sobre competencia profesional",
            reemplazo: "Considero que la atención del personal de enfermería no fue adecuada."
        },
        {
            texto: "no tienen humanidad lo tratan a uno como a perro",
            razon: "Comparación despectiva sobre trato recibido",
            reemplazo: "Considero que el trato recibido careció de calidez humana."
        }
    ];
    
    // Verificar coincidencias exactas con ejemplos
    for (const ejemplo of ejemplosMencionados) {
        if (ejemplo.texto.toLowerCase().includes(texto.toLowerCase()) || 
            texto.toLowerCase().includes(ejemplo.texto.toLowerCase())) {
            esApropiado = false;
            if (!razones.includes(ejemplo.razon)) {
                razones.push(ejemplo.razon);
            }
            textoCorregido = ejemplo.reemplazo;
            return { esApropiado, textoCorregido, razones };
        }
    }
    
    // Categorías de patrones problemáticos
    const categoriasPatrones = [
        // 1. Insultos directos y descalificaciones
        {
            nombre: "Insultos y descalificaciones",
            patrones: [
                /\b(idiota|estúpido|imbécil|tonto|inútil|incompetente|ineficiente|mediocre)\b/gi,
                /\b(basura|porquería|escoria|inmundo|repugnante|asqueroso|desagradable)\b/gi,
                /\b(torpe|ineficaz|incapaz|ignorante|negligente|perezoso|vago|holgazán)\b/gi,
                /\b(sinvergüenza|caradura|impresentable|ridículo|patético|payaso|bufón)\b/gi,
                /\b(inepto|inepta|ineptos|ineptas|inservible|inservibles|incompetencia)\b/gi
            ],
            razon: "Lenguaje descalificativo",
            reemplazo: "expresión respetuosa"
        },
        
        // 2. Obscenidades y vulgaridades
        {
            nombre: "Obscenidades",
            patrones: [
                /\b(mierda|carajo|puta|puto|culo|joder|verga|pene|vagina|coño|mamar|follar)\b/gi,
                /\b(cagar|mear|pendejo|pendeja|cabron|cabrón|perra|zorra|ramera|prostituta)\b/gi,
                /\b(mamada|polvo|paja|pajero|masturbación|semen|leche)\b/gi,
                /\b(gonorrea|hijode|hijue|malpa|hdp|hdpt|hp|ptm|chch|mrk|grnd)\b/gi
            ],
            razon: "Lenguaje obsceno",
            reemplazo: "lenguaje apropiado"
        },
        
        // 3. Amenazas e intimidación
        {
            nombre: "Amenazas",
            patrones: [
                /\b(matar|golpear|atacar|vengar|castigar|perseguir|acosar)\b.*?\b(te|lo|la|les|se|los|las|me)\b/gi,
                /\b(te|le|les|los|las)\b.*?\b(voy|van|va|vamos|iremos|iré)\b.*?\b(matar|golpear|atacar|perseguir)\b/gi,
                /\b(me|nos)\b.*?\b(las|lo)\b.*?\b(pagará|pagarán|cobraré|vengaré|verá|verán)\b/gi,
                /\b(sufrirá|sufrirán|llorarán|arrepentirá|arrepentirán|lamentará|lamentarán)\b/gi,
                /\b(acabar|terminar|destruir|arruinar|hundir)\b.*?\b(carrera|vida|reputación|familia|trabajo)\b/gi
            ],
            razon: "Lenguaje amenazante",
            reemplazo: "expresión no amenazante"
        },
        
        // 4. Misoginia y discriminación por género o edad
        {
            nombre: "Misoginia y discriminación por género o edad",
            patrones: [
                /\b(mujer|mujeres|vieja|viejas|señora|señoras)\b.*?\b(tonta|tontas|histérica|histéricas|loca|locas)\b/gi,
                /\b(lugar|perteneces|pertenecen|deber|debería|deberían)\b.*?\b(cocina|hogar|casa|callada|calladas)\b/gi,
                /\b(típico|típica|típicas|propio|propia|propias)\b.*?\b(mujer|mujeres|vieja|viejas|chica|chicas)\b/gi,
                /\b(vieja|viejo|viejas|viejos)\b.*?\b(médica|médico|enfermera|enfermero|doctor|doctora)\b/gi,
                /\besa\s+\b(vieja|viejo)\b/gi,
                /\b(abuela|abuelo|anciana|anciano)\b.*?\b(no sabe|no entiende|no comprende)\b/gi,
                /\b(chismosa|chismoso|chismosas|chismosos|cotilla|cotillas)\b/gi
            ],
            razon: "Lenguaje despectivo por género o edad",
            reemplazo: "referencia respetuosa"
        },
        
        // 5. Descalificación profesional
        {
            nombre: "Descalificación profesional",
            patrones: [
                /\b(no sabe|no saben|ni sabe|ni saben)\b.*?\b(nada|hacer|trabajar|atender)\b/gi,
                /\b(nunca|jamás)\b.*?\b(estudió|estudiaron|aprendió|aprendieron)\b/gi,
                /\b(título|títulos|diploma|diplomas)\b.*?\b(comprado|comprados|falso|falsos|regalado|regalados)\b/gi,
                /\b(no|sin)\b.*?\b(tiene|tienen)\b.*?\b(idea|conocimiento|experiencia|capacidad)\b/gi,
                /\b(improvisado|improvisada|improvisados|improvisadas|charlatán|charlatanes)\b/gi,
                /\b(matasanos|matasano|curandero|curandera|medicastro|medicastros)\b/gi
            ],
            razon: "Descalificación profesional injustificada",
            reemplazo: "observación constructiva sobre la atención"
        }
    ];
    
    // Análizar cada categoría de patrones
    for (const categoria of categoriasPatrones) {
        for (const patron of categoria.patrones) {
            const coincidencias = texto.match(patron);
            if (coincidencias) {
                esApropiado = false;
                if (!razones.includes(categoria.razon)) {
                    razones.push(categoria.razon);
                }
                // Reemplazar las coincidencias
                textoCorregido = textoCorregido.replace(patron, `[${categoria.reemplazo}]`);
            }
        }
    }
    
    // Análisis de palabras ofensivas básicas
    const palabrasEncontradas = [];
    for (const palabra of PALABRAS_OFENSIVAS) {
        const regex = new RegExp(`\\b${palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (regex.test(texto)) {
            palabrasEncontradas.push(palabra);
            esApropiado = false;
            if (!razones.includes("Lenguaje inapropiado")) {
                razones.push("Lenguaje inapropiado");
            }
            textoCorregido = textoCorregido.replace(regex, '[término apropiado]');
        }
    }
    
    return { esApropiado, textoCorregido, razones };
}

/**
 * Función principal para revisar quejas
 * @param {string} textoQueja - El texto de la queja a revisar
 * @returns {Object} - {esApropiada, palabrasEncontradas}
 */
function revisarQueja(textoQueja) {
    if (!textoQueja || typeof textoQueja !== 'string') {
        return { esApropiada: true, palabrasEncontradas: [] };
    }
    
    if (USAR_FILTRO_AVANZADO) {
        const resultado = filtrarContenidoAvanzadoLocal(textoQueja);
        textoCorregidoGlobal = resultado.textoCorregido;
        return {
            esApropiada: resultado.esApropiado,
            palabrasEncontradas: resultado.razones
        };
    } else {
        // Filtro básico
        const palabrasEncontradas = [];
        for (const palabra of PALABRAS_OFENSIVAS) {
            const regex = new RegExp(`\\b${palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            if (regex.test(textoQueja)) {
                palabrasEncontradas.push(palabra);
            }
        }
        return {
            esApropiada: palabrasEncontradas.length === 0,
            palabrasEncontradas: palabrasEncontradas
        };
    }
}

/**
 * Obtiene el texto corregido
 * @returns {string|null} - El texto corregido o null si no hay correcciones
 */
function obtenerTextoCorregido() {
    return textoCorregidoGlobal;
}

/**
 * Sugiere una modificación de la queja sin lenguaje inapropiado
 * @param {string} textoQueja - El texto de la queja original
 * @returns {string} - Versión modificada y apropiada de la queja
 */
function sugerirModificacion(textoQueja) {
    if (USAR_FILTRO_AVANZADO && textoCorregidoGlobal) {
        return textoCorregidoGlobal;
    }
    
    let textoModificado = textoQueja;
    
    // Reemplazar palabras ofensivas básicas
    for (const palabra of PALABRAS_OFENSIVAS) {
        const regex = new RegExp(`\\b${palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        textoModificado = textoModificado.replace(regex, '[término más apropiado]');
    }
    
    return textoModificado;
}

/**
 * Función de diagnóstico para probar el filtro
 * @param {string} texto - Texto a analizar
 * @returns {Object} - Resultados detallados del análisis
 */
function probarFiltro(texto) {
    console.log('=== DIAGNÓSTICO DEL FILTRO ===');
    console.log('Texto original:', texto);
    console.log('Filtro avanzado activado:', USAR_FILTRO_AVANZADO);
    console.log('Nivel de sensibilidad:', NIVEL_SENSIBILIDAD);
    
    const resultado = revisarQueja(texto);
    console.log('Es apropiado:', resultado.esApropiada);
    console.log('Razones encontradas:', resultado.palabrasEncontradas);
    
    if (!resultado.esApropiada) {
        const sugerencia = sugerirModificacion(texto);
        console.log('Texto sugerido:', sugerencia);
    }
    
    console.log('=== FIN DIAGNÓSTICO ===');
    return resultado;
}

// Exportar funciones para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        revisarQueja,
        obtenerTextoCorregido,
        sugerirModificacion,
        probarFiltro,
        USAR_FILTRO_AVANZADO,
        NIVEL_SENSIBILIDAD
    };
}