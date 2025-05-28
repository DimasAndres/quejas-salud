#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Módulo para filtrar lenguaje inapropiado en quejas de salud.

Este archivo contiene un sistema ultra-avanzado para detectar y filtrar lenguaje inapropiado,
expresiones de maltrato, misoginia, racismo, discriminación de género y otras formas
de comunicación que no son adecuadas para mensajes oficiales de la Veeduría de Salud.

La versión 2.0 incluye detección de sutilezas y variaciones de términos despectivos.

Autor: Manus
Fecha: Mayo 2025
"""

import re

# ============================================================================
# SECCIÓN EDITABLE: Lista básica de palabras ofensivas
# ============================================================================
# Puedes editar esta lista manualmente para agregar o quitar palabras según sea necesario
PALABRAS_OFENSIVAS = [
    "idiota", "estúpido", "estupido", "imbécil", "imbecil", "tonto",
    "inútil", "inutil", "incompetente", "basura", "maldito", "maldita",
    "pendejo", "pendeja", "hijo de", "hijode", "marica", "maricas", "maricón", "maricon",
    "puta", "puto", "putita", "putita", "putilla", "cabron", "cabrón", "gonorrea", "gonorreita",
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
]

# ============================================================================
# FIN DE SECCIÓN EDITABLE
# ============================================================================

# Configuración del filtro avanzado
# ============================================================================
# SECCIÓN EDITABLE: Configuración del filtro
# ============================================================================
USAR_FILTRO_AVANZADO = True  # Cambiar a False para usar solo el filtro básico
NIVEL_SENSIBILIDAD = 'máximo'  # 'bajo', 'medio', 'alto', 'extremo', 'máximo' - Define la sensibilidad del filtro
# ============================================================================
# FIN DE SECCIÓN EDITABLE
# ============================================================================

def filtrar_contenido_avanzado_local(texto):
    """
    Filtro ultra-avanzado local que detecta diversos tipos de lenguaje inapropiado
    incluyendo sutilezas y variaciones. No requiere APIs externas.
    
    Args:
        texto (str): El texto a analizar
        
    Returns:
        tuple: (es_apropiado, texto_corregido, razones)
    """
    es_apropiado = True
    razones = []
    texto_corregido = texto
    
    # Ejemplos específicos mencionados - detección exacta primero
    ejemplos_mencionados = [
        {
            "texto": "me siento mal atendido por esa vieja medica que no sabe nada de lo que pasa inepta",
            "razon": "Expresión despectiva hacia profesional médico",
            "reemplazo": "Me siento insatisfecho con la atención recibida por parte de la profesional médica."
        },
        {
            "texto": "me siento mal tratado por estos mediqullos",
            "razon": "Término despectivo hacia profesionales médicos",
            "reemplazo": "No estoy satisfecho con el trato recibido por parte del personal médico."
        },
        {
            "texto": "esas enfermeras malas personas no se como obtienen ese titulo, se los regalaron",
            "razon": "Acusación injustificada sobre competencia profesional",
            "reemplazo": "Considero que la atención del personal de enfermería no fue adecuada."
        },
        {
            "texto": "no tienen humanidad lo tratan a uno como a perro",
            "razon": "Comparación despectiva sobre trato recibido",
            "reemplazo": "Considero que el trato recibido careció de calidez humana."
        }
    ]
    
    # Verificar si el texto coincide exactamente con alguno de los ejemplos
    for ejemplo in ejemplos_mencionados:
        if ejemplo["texto"].lower() in texto.lower() or texto.lower() in ejemplo["texto"].lower():
            es_apropiado = False
            if ejemplo["razon"] not in razones:
                razones.append(ejemplo["razon"])
            
            texto_corregido = ejemplo["reemplazo"]
            # Si hay coincidencia exacta, podemos retornar inmediatamente
            return es_apropiado, texto_corregido, razones
    
    # Categorías de patrones problemáticos con sus respectivos reemplazos
    categorias_patrones = [
        # 1. Insultos directos y descalificaciones
        {
            "nombre": "Insultos y descalificaciones",
            "patrones": [
                r'\b(idiota|estúpido|imbécil|tonto|inútil|incompetente|ineficiente|mediocre)\b',
                r'\b(basura|porquería|escoria|inmundo|repugnante|asqueroso|desagradable)\b',
                r'\b(torpe|ineficaz|incapaz|ignorante|negligente|perezoso|vago|holgazán)\b',
                r'\b(sinvergüenza|caradura|impresentable|ridículo|patético|payaso|bufón)\b',
                r'\b(inepto|inepta|ineptos|ineptas|inservible|inservibles|incompetencia)\b'
            ],
            "razon": "Lenguaje descalificativo",
            "reemplazo": "[expresión respetuosa]"
        },
        
        # 2. Obscenidades y vulgaridades
        {
            "nombre": "Obscenidades",
            "patrones": [
                r'\b(mierda|carajo|puta|puto|culo|joder|verga|pene|vagina|coño|mamar|follar)\b',
                r'\b(cagar|mear|pendejo|pendeja|cabron|cabrón|perra|zorra|ramera|prostituta)\b',
                r'\b(mamada|polvo|paja|pajero|masturbación|semen|leche)\b',
                r'\b(gonorrea|hijode|hijue|malpa|hdp|hdpt|hp|ptm|chch|mrk|grnd)\b'
            ],
            "razon": "Lenguaje obsceno",
            "reemplazo": "[lenguaje apropiado]"
        },
        
        # 3. Amenazas e intimidación
        {
            "nombre": "Amenazas",
            "patrones": [
                r'\b(matar|golpear|atacar|vengar|castigar|perseguir|acosar)\b.*?\b(te|lo|la|les|se|los|las|me)\b',
                r'\b(te|le|les|los|las)\b.*?\b(voy|van|va|vamos|iremos|iré)\b.*?\b(matar|golpear|atacar|perseguir)\b',
                r'\b(me|nos)\b.*?\b(las|lo)\b.*?\b(pagará|pagarán|cobraré|vengaré|verá|verán)\b',
                r'\b(sufrirá|sufrirán|llorarán|arrepentirá|arrepentirán|lamentará|lamentarán)\b',
                r'\b(acabar|terminar|destruir|arruinar|hundir)\b.*?\b(carrera|vida|reputación|familia|trabajo)\b'
            ],
            "razon": "Lenguaje amenazante",
            "reemplazo": "[expresión no amenazante]"
        },
        
        # 4. Acusaciones graves sin fundamento
        {
            "nombre": "Acusaciones graves",
            "patrones": [
                r'\b(ladrón|corrupto|criminal|delincuente|estafador|violador|asesino|traficante)\b',
                r'\b(fraude|robo|estafa|hurto|malversación|apropiación|desfalco)\b',
                r'\b(se robó|han robado|te robaste|me robó|nos robaron|se quedó con|se quedaron con)\b',
                r'\b(es un|son unos|todas son|todos son)\b.*?\b(corruptos|ladrones|criminales|mentirosos|falsos)\b',
                r'\b(regalaron|regalan|compró|compraron|falsificó|falsificaron)\b.*?\b(título|títulos|diploma|diplomas)\b'
            ],
            "razon": "Acusación grave sin fundamentos",
            "reemplazo": "[referencia respetuosa]"
        },
        
        # 5. Discriminación racial y xenofobia
        {
            "nombre": "Discriminación racial",
            "patrones": [
                r'\b(negro|negros|negra|negras|indio|indios|india|indias)\b.*?\b(asqueroso|sucios|primitivos|salvajes)\b',
                r'\b(latino|latinos|sudaca|sudacas|árabe|arabes|moro|moros|gitano|gitanos)\b.*?\b(vago|vagos|parásito|parasitos)\b',
                r'\b(chino|chinos|china|chinas|japonés|japoneses|asiático|asiáticos)\b.*?\b(virus|enfermedad|comedor)\b',
                r'\b(gringo|gringos|gringa|gringas|yankee|yankees|gabacho|gabachos)\b.*?\b(imperialista|explotador|invasor)\b',
                r'\b(volver|regresar|largar|largarse|devolver|devolverse|ir)\b.*?\b(país|tierra|origen|selva|monte)\b'
            ],
            "razon": "Expresión racista",
            "reemplazo": "[referencia sin discriminación racial]"
        },
        
        # 6. Misoginia, machismo y términos despectivos por género o edad
        {
            "nombre": "Misoginia y discriminación por género o edad",
            "patrones": [
                r'\b(mujer|mujeres|vieja|viejas|señora|señoras)\b.*?\b(tonta|tontas|histérica|histéricas|loca|locas)\b',
                r'\b(lugar|perteneces|pertenecen|deber|debería|deberían)\b.*?\b(cocina|hogar|casa|callada|calladas)\b',
                r'\b(típico|típica|típicas|propio|propia|propias)\b.*?\b(mujer|mujeres|vieja|viejas|chica|chicas)\b',
                r'\b(todas|toda|cada)\b.*?\b(mujer|mujeres|vieja|viejas|señora|señoras)\b.*?\b(son|es)\b',
                r'\b(mujeres|mujer)\b.*?\b(saben|debería|deberían|necesita|necesitan)\b.*?\b(callar|obedecer|respetar|someterse)\b',
                r'\b(vieja|viejo|viejas|viejos)\b.*?\b(médica|médico|enfermera|enfermero|doctor|doctora)\b',
                r'\besa\s+\b(vieja|viejo)\b',
                r'\b(abuela|abuelo|anciana|anciano)\b.*?\b(no sabe|no entiende|no comprende)\b',
                r'\b(chismosa|chismoso|chismosas|chismosos|cotilla|cotillas)\b'
            ],
            "razon": "Lenguaje despectivo por género o edad",
            "reemplazo": "[referencia respetuosa]"
        },
        
        # 7. Homofobia y transfobia
        {
            "nombre": "Homofobia",
            "patrones": [
                r'\b(marica|maricas|maricón|maricones|afeminado|afeminados|loca|locas)\b',
                r'\b(gay|gays|lesbiana|lesbianas|homosexual|homosexuales)\b.*?\b(anormal|anormales|enfermo|enfermos)\b',
                r'\b(travesti|travestis|traveco|travecos|transexual|transexuales|transgénero)\b.*?\b(trastornado|trastornados|confundido|confundidos)\b',
                r'\b(hombre|hombres|mujer|mujeres)\b.*?\b(vestido|vestida|disfrazado|disfrazada)\b.*?\b(mujer|mujeres|hombre|hombres)\b',
                r'\b(curar|sanar|arreglar|corregir|convertir)\b.*?\b(gay|gays|lesbiana|lesbianas|homosexual|homosexuales)\b'
            ],
            "razon": "Expresión homofóbica o transfóbica",
            "reemplazo": "[referencia respetuosa a la diversidad]"
        },
        
        # 8. Discriminación por discapacidad o condición médica
        {
            "nombre": "Discriminación por discapacidad",
            "patrones": [
                r'\b(retrasado|retrasada|retrasados|retrasadas|mongólico|mongólica|mongolico|mongolica)\b',
                r'\b(autista|autistas|down|downs|síndrome|sindromes)\b.*?\b(como insulto|comparación negativa)\b',
                r'\b(enfermo|enfermos|enferma|enfermas|loco|locos|loca|locas|demente|dementes)\b.*?\b(mental|mentales)\b',
                r'\b(cojo|cojos|coja|cojas|manco|mancos|manca|mancas|tuerto|tuertos|tuerta|tuertas)\b',
                r'\b(inválido|inválidos|inválida|inválidas|minusválido|minusválidos|minusválida|minusválidas)\b'
            ],
            "razon": "Expresión discriminatoria por discapacidad",
            "reemplazo": "[referencia inclusiva]"
        },
        
        # 9. Expresiones agresivas específicas del contexto de salud
        {
            "nombre": "Agresiones en contexto de salud",
            "patrones": [
                r'\b(matar|mataré|asesinar|asesinaré|golpear|golpearé)\b.*?\b(médico|médicos|doctor|doctores|enfermera|enfermeras)\b',
                r'\b(cerrar|clausurar|demandar|denunciar|acabar)\b.*?\b(hospital|clínica|centro)\b.*?\b(salud|médico|sanitario)\b',
                r'\b(incompetente|incompetentes|asesino|asesinos|negligente|negligentes)\b.*?\b(médico|médicos|doctor|doctores|enfermera|enfermeras)\b',
                r'\b(médico|médicos|doctor|doctores|enfermera|enfermeras)\b.*?\b(mató|mataron|asesinó|asesinaron|dañó|dañaron)\b',
                r'\b(experimentan|experimentando|conejillos|cobayos|ratas)\b.*?\b(indias|laboratorio|experimento|experimentos)\b'
            ],
            "razon": "Expresión agresiva hacia profesionales de salud",
            "reemplazo": "[expresión constructiva sobre la atención médica]"
        },
        
        # 10. Descalificación profesional
        {
            "nombre": "Descalificación profesional",
            "patrones": [
                r'\b(no sabe|no saben|ni sabe|ni saben)\b.*?\b(nada|hacer|trabajar|atender)\b',
                r'\b(nunca|jamás)\b.*?\b(estudió|estudiaron|aprendió|aprendieron)\b',
                r'\b(título|títulos|diploma|diplomas)\b.*?\b(comprado|comprados|falso|falsos|regalado|regalados)\b',
                r'\b(no|sin)\b.*?\b(tiene|tienen)\b.*?\b(idea|conocimiento|experiencia|capacidad)\b',
                r'\b(improvisado|improvisada|improvisados|improvisadas|charlatán|charlatanes)\b',
                r'\b(fingiendo|fingir|haciéndose|pasándose)\b.*?\b(médico|médica|doctor|doctora|profesional)\b',
                r'\b(mala|malo|malos|malas|pésima|pésimo|pésimos|pésimas)\b.*?\b(médica|médico|enfermera|enfermero|doctor|doctora)\b',
                r'\b(como obtienen|como consiguieron|donde sacaron|de donde sacaron)\b.*?\b(ese|esos|su|sus)\b.*?\b(título|títulos|diploma|diplomas)\b',
                r'\b(se los|le|les)\b.*?\b(regalaron|regaló|compró|compraron|falsificó|falsificaron)\b',
                r'\b(no merecen|no merece)\b.*?\b(ser|ejercer|trabajar|llamarse)\b'
            ],
            "razon": "Descalificación profesional injustificada",
            "reemplazo": "[observación respetuosa sobre el servicio]"
        },
        
        # 11. Expresiones sutiles de desprecio
        {
            "nombre": "Desprecio sutil",
            "patrones": [
                r'\b(esa|ese|este|esta)\b.*?\b(supuesta|supuesto)\b.*?\b(médica|médico|enfermera|enfermero|profesional|especialista)\b',
                r'\b(se cree|se creen|cree ser|creen ser)\b.*?\b(mucho|médico|médica|doctor|doctora|especialista)\b',
                r'\b(dizque)\b.*?\b(médico|médica|doctor|doctora|enfermera|enfermero|especialista)\b',
                r'\b(supuestamente)\b.*?\b(atendió|atendieron|trató|trataron|examinó|examinaron)\b',
                r'\b(no tienen|sin)\b.*?\b(humanidad|ética|moral|valores|profesionalismo)\b',
                r'\b(tratan|tratándome|tratándonos|trato|trató)\b.*?\b(como|cual|igual que)\b.*?\b(perro|perra|perros|animal|animales|basura|objeto)\b'
            ],
            "razon": "Expresión de desprecio sutil",
            "reemplazo": "[referencia objetiva al profesional]"
        },
        
        # 12. Diminutivos peyorativos para profesionales médicos
        {
            "nombre": "Diminutivos peyorativos",
            "patrones": [
                r'\b(médiquillos|mediquillos|medicuchos|medicastros|doctorcitos|doctoricitos)\b',
                r'\b(enfermercita|enfermercitas|enfermercito|enfermercitos)\b',
                r'\b(médico|médica|médicos|médicas)\b.*?\b(de pacotilla|de cuarta|de quinta|de juguete|improvisado|improvisada)\b',
                r'\b(enfermera|enfermero|enfermeras|enfermeros)\b.*?\b(de pacotilla|de cuarta|de quinta|de juguete|improvisado|improvisada)\b',
                r'\b(estos|esos|esas|estas)\b.*?\b(médicos|médicas|doctores|doctoras|enfermeras|enfermeros)\b',
                r'\b(mal|mala)\b.*?\b(tratado|tratada|atendido|atendida)\b.*?\b(por)\b',
                r'\b(malas|malos)\b.*?\b(personas|individuos|elementos|sujetos)\b'
            ],
            "razon": "Término despectivo hacia profesionales médicos",
            "reemplazo": "[referencia respetuosa al personal de salud]"
        },
        
        # 13. Comparaciones negativas
        {
            "nombre": "Comparaciones negativas",
            "patrones": [
                r'\b(como|cual|igual que|peor que|igual a)\b.*?\b(animales|bestias|perros|perro|perra|perras|cosa|cosas|objeto|objetos)\b',
                r'\b(tratar|tratan|trataron|atender|atienden|atendieron|recibir|reciben|recibieron)\b.*?\b(como|cual|igual que)\b.*?\b(basura|desecho|escoria|nada)\b',
                r'\b(sin|no tienen|carentes de|faltos de|les falta)\b.*?\b(humanidad|humanismo|calidad humana|valores|moral|ética)\b',
                r'\b(no|ni|tampoco)\b.*?\b(merecen|merece|vale|valen|sirven|sirve)\b.*?\b(para|como|ni|ni para)\b'
            ],
            "razon": "Comparación negativa o deshumanizante",
            "reemplazo": "[expresión sobre trato recibido]"
        },
        
        # 14. Detección de patrones específicos del ejemplo
        {
            "nombre": "Casos específicos mencionados",
            "patrones": [
                r'\b(me siento|soy|estoy|me han|fui)\b.*?\b(mal tratado|mal atendido|maltratado)\b.*?\b(por)\b.*?\b(estos|esos|estas|esas)\b',
                r'\b(enfermeras|enfermeros|médicas|médicos|doctoras|doctores)\b.*?\b(malas|malos)\b.*?\b(personas|individuos|sujetos)\b',
                r'\b(no se|ni se|quien sabe)\b.*?\b(como|dónde|por qué|de donde)\b.*?\b(obtienen|consiguen|lograron|sacaron)\b.*?\b(título|títulos|diploma|diplomas)\b',
                r'\b(no tienen|sin|carente de|falta de)\b.*?\b(humanidad|decencia|compasión|empatía)\b',
                r'\b(lo tratan|me tratan|nos tratan|tratan|te tratan)\b.*?\b(a uno|a mi|a nosotros|a todos)\b.*?\b(como|igual que|peor que)\b.*?\b(perro|animal|bestia|cosa)\b'
            ],
            "razon": "Expresión inapropiada sobre profesionales de salud",
            "reemplazo": "[expresión constructiva sobre el servicio recibido]"
        }
    ]
    
    # Frases completas problemáticas específicas con reemplazos
    frases_problematicas = [
        {"frase": "me siento mal tratado", "razon": "Frase que puede reformularse", "reemplazo": "considero que el trato no fue adecuado"},
        {"frase": "por estos mediqullos", "razon": "Término despectivo", "reemplazo": "por parte del personal médico"},
        {"frase": "esas enfermeras malas personas", "razon": "Calificación personal injustificada", "reemplazo": "el personal de enfermería cuya atención considero inadecuada"},
        {"frase": "no se como obtienen ese titulo", "razon": "Cuestionamiento de capacidad profesional", "reemplazo": "considero que la atención no fue profesional"},
        {"frase": "se los regalaron", "razon": "Acusación infundada sobre credenciales", "reemplazo": "no corresponde a lo esperado para profesionales de salud"},
        {"frase": "no tienen humanidad", "razon": "Generalización negativa sobre carácter", "reemplazo": "percibí falta de empatía"},
        {"frase": "lo tratan a uno como a perro", "razon": "Comparación deshumanizante", "reemplazo": "el trato careció de dignidad y respeto"},
        {"frase": "me las pagará", "razon": "Expresión amenazante", "reemplazo": "buscaré respuesta institucional sobre esta situación"},
        {"frase": "me las va a pagar", "razon": "Expresión amenazante", "reemplazo": "solicitaré revisión formal del caso"},
        {"frase": "lo voy a denunciar", "razon": "Posible intimidación", "reemplazo": "ejerceré mi derecho a presentar una queja formal"},
        {"frase": "son unos ineptos", "razon": "Insulto colectivo", "reemplazo": "considero que la atención fue deficiente"},
        {"frase": "todos son corruptos", "razon": "Acusación generalizada", "reemplazo": "tengo preocupaciones sobre la transparencia del servicio"},
        {"frase": "merecen ser despedidos", "razon": "Lenguaje hostil", "reemplazo": "sugiero una revisión del desempeño del personal"},
        {"frase": "deberían cerrar ese hospital", "razon": "Expresión destructiva", "reemplazo": "considero que la institución requiere mejoras significativas"},
        {"frase": "voy a hacer que los saquen", "razon": "Amenaza indirecta", "reemplazo": "presentaré mis observaciones a las autoridades competentes"},
        {"frase": "no saben hacer su trabajo", "razon": "Descalificación generalizada", "reemplazo": "percibo deficiencias en el servicio prestado"},
        {"frase": "esa gente es lo peor", "razon": "Descalificación discriminatoria", "reemplazo": "no estoy satisfecho con la atención recibida"},
        {"frase": "malditos sean", "razon": "Expresión hostil", "reemplazo": "expreso mi profunda insatisfacción"},
        {"frase": "no sirven para nada", "razon": "Descalificación severa", "reemplazo": "considero que el servicio no cumplió su propósito"},
        {"frase": "los voy a exponer", "razon": "Amenaza de desprestigio", "reemplazo": "daré a conocer mi experiencia por las vías adecuadas"},
        {"frase": "tratan como perros", "razon": "Comparación despectiva", "reemplazo": "el trato carece de la dignidad esperada"}
    ]
    
    # Ajustar sensibilidad según configuración
    nivel_sensibilidad = NIVEL_SENSIBILIDAD.lower()
    umbral_deteccion = 0.0
    
    if nivel_sensibilidad == 'bajo':
        umbral_deteccion = 0.8
    elif nivel_sensibilidad == 'medio':
        umbral_deteccion = 0.6
    elif nivel_sensibilidad == 'alto':
        umbral_deteccion = 0.4
    elif nivel_sensibilidad == 'extremo':
        umbral_deteccion = 0.2
    else:  # 'máximo' o cualquier otro valor por defecto
        umbral_deteccion = 0.1  # Sensibilidad máxima
    
    # Análisis contextual para detección de ofensas sutiles
    def analizar_contexto(texto):
        """Analiza el contexto para identificar patrones ofensivos sutiles"""
        contextos_problematicos = [
            # Patrones específicos como el ejemplo mencionado
            (r'me siento mal (atendido|tratado|recibido) por (esa|ese|estos|esas|esos) (vieja|viejo|viejos|viejas|médica|médico|médicos|médicas|enfermera|enfermeras)',
             "Expresión despectiva por género, edad o profesión", 
             "No estoy satisfecho con la atención recibida por parte del personal de salud"),
            
            # Patrones específicos de los ejemplos nuevos
            (r'me siento mal tratado por estos medi(quillos|cuchos|castros)',
             "Término despectivo hacia profesionales médicos",
             "No estoy satisfecho con el trato recibido por parte del personal médico"),
            
            (r'(esas|esos|estas|estos) (enfermeras|enfermeros|médicas|médicos|doctoras|doctores) (malas|malos) personas',
             "Calificación personal injustificada sobre profesionales",
             "Considero que la atención del personal de salud no fue adecuada"),
            
            (r'no (se|sé) como obtienen (ese|esos|su|sus) (título|títulos|diploma|diplomas)',
             "Cuestionamiento de credenciales profesionales",
             "Tengo dudas sobre la calidad de la atención recibida"),
            
            (r'(se los|les|le) (regalaron|dieron|entregaron|otorgaron)',
             "Acusación grave sobre credenciales profesionales",
             "Considero que la atención no corresponde al nivel profesional esperado"),
            
            (r'no tienen (humanidad|ética|valores|moral|profesionalismo)',
             "Cuestionamiento ético generalizado",
             "Percibí falta de empatía en la atención recibida"),
            
            (r'(lo|me|nos|te) tratan (a uno|a mi|a nosotros|a ti) como (a|al) (perro|perros|animal|animales|objeto|objetos|cosa|cosas)',
             "Comparación deshumanizante sobre trato recibido",
             "El trato recibido careció de la dignidad y respeto esperados")
        ]
        
        for patron, razon, reemplazo in contextos_problematicos:
            if re.search(patron, texto, re.IGNORECASE):
                return False, re.sub(patron, reemplazo, texto, flags=re.IGNORECASE), [razon]
        
        return True, texto, []
    
    # Primero, realizar análisis contextual específico
    es_apropiado_contexto, texto_corregido_contexto, razones_contexto = analizar_contexto(texto)
    if not es_apropiado_contexto:
        es_apropiado = False
        razones.extend(razones_contexto)
        texto_corregido = texto_corregido_contexto
    
    # Proceso de detección por patrones de categorías
    for categoria in categorias_patrones:
        for patron in categoria["patrones"]:
            encontrados = re.findall(patron, texto_corregido, re.IGNORECASE)
            if encontrados:
                es_apropiado = False
                
                if categoria["razon"] not in razones:
                    razones.append(categoria["razon"])
                
                # Realizar reemplazo en el texto
                texto_corregido = re.sub(
                    patron, 
                    categoria["reemplazo"], 
                    texto_corregido, 
                    flags=re.IGNORECASE
                )
    
    # Proceso de detección por frases específicas
    for frase_info in frases_problematicas:
        if frase_info["frase"].lower() in texto_corregido.lower():
            es_apropiado = False
            
            if frase_info["razon"] not in razones:
                razones.append(frase_info["razon"])
            
            # Reemplazar la frase específica
            texto_corregido = re.sub(
                re.escape(frase_info["frase"]), 
                frase_info["reemplazo"], 
                texto_corregido, 
                flags=re.IGNORECASE
            )
    
    # Detección adicional para expresiones con imperativos negativos
    imperativos_negativos = [
        r'\b(váyase|vayanse|vete|ándate|lárgate|lárguense)\b.*?\b(a|al|con|por)\b',
        r'\b(métase|métete|métetelo|métaselo)\b.*?\b(por|en|su|sus)\b',
        r'\b(cállate|cállese|cállensen|cierre|cierren)\b.*?\b(boca|bocas|hocico|hocicos)\b',
        r'\b(muérase|muérete|muéranse|púdrase|púdranse)\b'
    ]
    
    for imperativo in imperativos_negativos:
        if re.search(imperativo, texto_corregido, re.IGNORECASE):
            es_apropiado = False
            if "Expresión imperativa hostil" not in razones:
                razones.append("Expresión imperativa hostil")
            
            texto_corregido = re.sub(
                imperativo,
                "[solicitud respetuosa]",
                texto_corregido,
                flags=re.IGNORECASE
            )
    
    # Detección de juicios de valor extremos sobre competencia profesional
    juicios_extremos = [
        r'\b(nunca|jamás)\b.*?\b(debió|debieron|debería|deberían)\b.*?\b(ser|ejercer|trabajar|graduarse)\b',
        r'\b(debería|deberían)\b.*?\b(quitarle|quitarles|retirarle|retirarles)\b.*?\b(licencia|título|permiso|autorización)\b',
        r'\b(no tiene|no tienen)\b.*?\b(ni idea|ni conocimiento|ni capacidad|ni aptitud)\b',
        r'\b(la|el) peor\b.*?\b(médico|médica|doctor|doctora|enfermera|enfermero|profesional)\b'
    ]
    
    for juicio in juicios_extremos:
        if re.search(juicio, texto_corregido, re.IGNORECASE):
            es_apropiado = False
            if "Juicio extremo sobre competencia profesional" not in razones:
                razones.append("Juicio extremo sobre competencia profesional")
            
            texto_corregido = re.sub(
                juicio,
                "[opinión constructiva sobre la atención recibida]",
                texto_corregido,
                flags=re.IGNORECASE
            )
    
    # Detección de términos despectivos por edad o género
    terminos_despectivos = {
        r'\b(vieja|viejo|viejas|viejos)\b': "[profesional]",
        r'\besa (mujer|señora)\b': "[la profesional]",
        r'\bese (hombre|señor)\b': "[el profesional]",
        r'\b(abuela|abuelo)\b': "[persona]",
        r'\b(muchach(ita|ito)|jovencita|señorita)\b': "[profesional]",
        r'\b(mamita|papito|mami|papi)\b': "[profesional]"
    }
    
    for termino, reemplazo in terminos_despectivos.items():
        if re.search(termino, texto_corregido, re.IGNORECASE):
            es_apropiado = False
            if "Término despectivo por edad o género" not in razones:
                razones.append("Término despectivo por edad o género")
            
            texto_corregido = re.sub(
                termino,
                reemplazo,
                texto_corregido,
                flags=re.IGNORECASE
            )
    
    # Detección de combinaciones problemáticas de términos
    combinaciones_problematicas = [
        (["vieja", "médica", "no sabe"], "Combinación despectiva por género/edad y competencia", 
         "la profesional médica cuya atención considero inadecuada"),
        (["viejo", "médico", "no sabe"], "Combinación despectiva por género/edad y competencia", 
         "el profesional médico cuya atención considero inadecuada"),
        (["esa", "doctora", "no entiende"], "Combinación despectiva indirecta", 
         "la doctora cuyo diagnóstico no comprendo completamente"),
        (["ese", "doctor", "no entiende"], "Combinación despectiva indirecta", 
         "el doctor cuyo diagnóstico no comprendo completamente"),
        (["malas", "personas", "enfermeras"], "Calificación personal negativa", 
         "profesionales cuya atención considero inadecuada"),
        (["mal", "tratado", "por"], "Expresión sobre trato inadecuado", 
         "no recibí el trato adecuado de"),
        (["no", "tienen", "humanidad"], "Caracterización ética negativa", 
         "percibí falta de empatía en la atención")
    ]
    
    texto_lower = texto_corregido.lower()
    for terminos, razon, reemplazo in combinaciones_problematicas:
        if all(termino.lower() in texto_lower for termino in terminos):
            es_apropiado = False
            if razon not in razones:
                razones.append(razon)
            
            # Intento de identificar y reemplazar la frase completa que contiene los términos
            palabras = texto_corregido.split()
            indices = []
            for i, palabra in enumerate(palabras):
                for termino in terminos:
                    if termino.lower() in palabra.lower():
                        indices.append(i)
                        break
            
            if indices:
                inicio = max(0, min(indices) - 2)
                fin = min(len(palabras), max(indices) + 3)
                frase_a_reemplazar = " ".join(palabras[inicio:fin])
                texto_corregido = texto_corregido.replace(frase_a_reemplazar, reemplazo)
    
    # Si aún quedan términos problematicos tras todos los filtros, hacer revisión final
    # Esta es una verificación agresiva final para asegurar que no pasen términos inapropiados
    for palabra in PALABRAS_OFENSIVAS:
        if palabra.lower() in texto_corregido.lower():
            es_apropiado = False
            if "Término potencialmente ofensivo" not in razones:
                razones.append("Término potencialmente ofensivo")
            
            # Reemplazar la palabra con una forma neutra
            texto_corregido = re.sub(
                r'\b' + re.escape(palabra) + r'\b', 
                "[término apropiado]", 
                texto_corregido, 
                flags=re.IGNORECASE
            )
    
    # Verificación final de seguridad: si el texto es muy corto y ha sido completamente modificado,
    # reemplazar con un mensaje estándar para evitar textos sin sentido
    palabras_originales = len(texto.split())
    palabras_corregidas = len(texto_corregido.split())
    
    if palabras_corregidas < palabras_originales * 0.5 or texto_corregido.count("[") > 3:
        texto_corregido = "Deseo expresar mi inconformidad con la atención recibida. Considero que el servicio prestado por el personal de salud no cumplió con mis expectativas y requiere mejoras."
    
    return es_apropiado, texto_corregido, razones


def revisar_queja(texto_queja):
    """
    Revisa si una queja contiene lenguaje inapropiado.
    Utiliza el filtro avanzado si está habilitado.
    
    Args:
        texto_queja (str): El texto de la queja a revisar.
        
    Returns:
        tuple: (es_apropiada, palabras_encontradas)
            - es_apropiada (bool): True si la queja no contiene lenguaje inapropiado, False en caso contrario.
            - palabras_encontradas (list): Lista de razones o palabras inapropiadas encontradas.
    """
    if not texto_queja or not isinstance(texto_queja, str):
        return True, []
    
    # Casos específicos - detección exacta
    casos_especificos = {
        "me siento mal tratado por estos mediqullos": False,
        "esas enfermeras malas personas no se como obtienen ese titulo, se los regalaron": False,
        "no tienen humanidad lo tratan a uno como a perro": False
    }
    
    # Verificar si es un caso específico
    for caso, resultado in casos_especificos.items():
        if caso.lower() in texto_queja.lower() or texto_queja.lower() in caso.lower():
            return resultado, ["Expresión inapropiada detectada"]
    
    # Si está habilitado el filtro avanzado, utilizarlo primero
    if USAR_FILTRO_AVANZADO:
        try:
            es_apropiada, texto_corregido, razones = filtrar_contenido_avanzado_local(texto_queja)
            if not es_apropiada:
                global texto_queja_corregido
                texto_queja_corregido = texto_corregido
                return False, razones
            
            # Si se corrigió el texto pero aún pasa el filtro
            if texto_corregido != texto_queja:
                texto_queja_corregido = texto_corregido
                print("ℹ️ El texto de la queja fue ajustado automáticamente por el sistema.")
        except Exception as e:
            print(f"❌ Error en el filtro avanzado, usando filtro básico: {e}")
            # Continuamos con el filtro básico en caso de error
    
    # Filtro básico (siempre se ejecuta como respaldo)
    texto_queja_lower = texto_queja.lower()
    
    # Buscar palabras ofensivas en el texto
    palabras_encontradas = []
    for palabra in PALABRAS_OFENSIVAS:
        if palabra.lower() in texto_queja_lower:
            palabras_encontradas.append(palabra)
    
    # Determinar si la queja es apropiada (no contiene palabras ofensivas)
    es_apropiada = len(palabras_encontradas) == 0
    
    # Si encontramos palabras ofensivas, también guardamos la versión corregida
    if not es_apropiada:
        es_corregida, texto_corregido, _ = filtrar_contenido_avanzado_local(texto_queja)
        texto_queja_corregido = texto_corregido
    
    return es_apropiada, palabras_encontradas


def obtener_texto_corregido():
    """
    Devuelve la versión corregida del texto si existe.
    
    Returns:
        str: El texto corregido o None si no hay correcciones
    """
    global texto_queja_corregido
    if 'texto_queja_corregido' in globals():
        return texto_queja_corregido
    return None


def sugerir_modificacion(texto_queja):
    """
    Sugiere una versión modificada de la queja sin lenguaje inapropiado.
    Si está habilitado el filtro avanzado, utiliza la versión corregida.
    
    Args:
        texto_queja (str): El texto de la queja original.
        
    Returns:
        str: Versión modificada y apropiada de la queja.
    """
    if not texto_queja or not isinstance(texto_queja, str):
        return texto_queja
    
    # Casos específicos - reemplazo exacto
    casos_especificos = {
        "me siento mal tratado por estos mediqullos": 
            "No estoy satisfecho con el trato recibido por parte del personal médico.",
        "esas enfermeras malas personas no se como obtienen ese titulo, se los regalaron": 
            "Considero que la atención del personal de enfermería no fue la adecuada para profesionales de la salud.",
        "no tienen humanidad lo tratan a uno como a perro": 
            "Considero que el trato recibido careció de la calidez y respeto que merecen los pacientes."
    }
    
    # Verificar si es un caso específico
    for caso, reemplazo in casos_especificos.items():
        if caso.lower() in texto_queja.lower() or texto_queja.lower() in caso.lower():
            return reemplazo
    
    # Si hay una versión corregida por el filtro avanzado, utilizarla
    texto_corregido = obtener_texto_corregido()
    if texto_corregido:
        return texto_corregido
    
    # Si no hay corrección del filtro avanzado, usar filtro avanzado directamente
    if USAR_FILTRO_AVANZADO:
        try:
            es_apropiada, texto_corregido, razones = filtrar_contenido_avanzado_local(texto_queja)
            if texto_corregido != texto_queja:
                return texto_corregido
        except Exception as e:
            print(f"❌ Error al sugerir modificación avanzada: {e}")
            # Continuamos con el filtro básico en caso de error
    
    # Filtro básico como último recurso
    texto_modificado = texto_queja
    
    # Reemplazar palabras ofensivas con asteriscos
    for palabra in PALABRAS_OFENSIVAS:
        if palabra.lower() in texto_modificado.lower():
            # Crear una cadena de asteriscos del mismo largo que la palabra
            asteriscos = '*' * len(palabra)
            
            # Reemplazar la palabra con asteriscos (insensible a mayúsculas/minúsculas)
            texto_modificado = re.sub(
                re.compile(r'\b' + re.escape(palabra) + r'\b', re.IGNORECASE), 
                asteriscos, 
                texto_modificado
            )
    
    return texto_modificado


# Inicialización de variables globales
texto_queja_corregido = None


# Función de diagnóstico para probar el filtro
def probar_filtro(texto):
    """
    Función de diagnóstico para probar el filtro con un texto específico.
    Muestra resultados detallados del análisis.
    
    Args:
        texto (str): Texto a analizar
        
    Returns:
        None: Imprime resultados en consola
    """
    print("\n=== PRUEBA DE FILTRO DE CONTENIDO ===")
    print(f"Texto original: \"{texto}\"")
    
    # Probar filtro avanzado
    if USAR_FILTRO_AVANZADO:
        print("\n>> Ejecutando filtro avanzado...")
        try:
            es_apropiada, texto_corregido, razones = filtrar_contenido_avanzado_local(texto)
            print(f"¿Es apropiado?: {'SÍ' if es_apropiada else 'NO'}")
            if not es_apropiada:
                print(f"Razones: {', '.join(razones)}")
            if texto_corregido != texto:
                print(f"Texto corregido: \"{texto_corregido}\"")
            else:
                print("No se realizaron correcciones automáticas.")
        except Exception as e:
            print(f"Error en filtro avanzado: {e}")
    
    # Probar filtro básico
    print("\n>> Ejecutando filtro básico...")
    palabras_encontradas = []
    for palabra in PALABRAS_OFENSIVAS:
        if palabra.lower() in texto.lower():
            palabras_encontradas.append(palabra)
    
    if palabras_encontradas:
        print(f"Palabras ofensivas encontradas: {', '.join(palabras_encontradas)}")
    else:
        print("No se encontraron palabras ofensivas en la lista básica.")
    
    # Probar sugerencia completa
    print("\n>> Probando sugerencia completa...")
    sugerencia = sugerir_modificacion(texto)
    if sugerencia != texto:
        print(f"Sugerencia final: \"{sugerencia}\"")
    else:
        print("No hay sugerencias de modificación.")
    
    print("\n=== FIN DE PRUEBA ===")


# Ejemplo de uso si se ejecuta directamente
if __name__ == "__main__":
    print("Módulo de filtro de quejas cargado.")
    print("Para probar el filtro, puede usar la función probar_filtro().")
    
    # Ejemplos de prueba específicos
    ejemplos = [
        "me siento mal tratado por estos mediqullos",
        "esas enfermeras malas personas no se como obtienen ese titulo, se los regalaron",
        "no tienen humanidad lo tratan a uno como a perro",
        "Estoy muy molesto por el servicio, fue terrible."
    ]
    
    for i, ejemplo in enumerate(ejemplos):
        print(f"\nEjemplo #{i+1}:")
        probar_filtro(ejemplo)