# Correos de destino
CORREOS_DESTINO = [
    "ingenierodimas@gmail.com",
    "veeduriasaludregional@gmail.com"
]

# Formulario de Google
FORMULARIO_URL = "https://script.google.com/macros/s/AKfycbz2zC5NiFfqhGck4yVgvcEuCY-zv64AB7OJSKd-PyMyH3NQMr1L0sakPyyNtxaiFkya/exec"
                # https://script.google.com/macros/s/AKfycbz2zC5NiFfqhGck4yVgvcEuCY-zv64AB7OJSKd-PyMyH3NQMr1L0sakPyyNtxaiFkya/exec
FORMULARIO_ACTIVO = True  # Cambiar a True cuando el formulario esté listo
# Credenciales del correo de la veeduría (para envío por defecto)
EMAIL_REMETENTE = "veedurianacionalsaludmagcol@gmail.com"
EMAIL_PASSWORD = "jhpxfxlrzzghztqj"

# Configuración del servidor SMTP
EMAIL_USER = EMAIL_REMETENTE  # puedes usar directamente
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587  # Usamos STARTTLS
