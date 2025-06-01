import os
import webbrowser
from kivy.app import App
from kivy.core.window import Window
from kivy.utils import platform
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.webview import WebView
from kivy.clock import Clock

class WebViewApp(App):
    def build(self):
        # Configurar la ventana
        Window.clearcolor = (1, 1, 1, 1)
        
        # Crear layout principal
        layout = BoxLayout(orientation='vertical')
        
        # Crear webview
        self.webview = WebView(
            url=self.get_local_url(),
            enable_javascript=True,
            enable_zoom=False
        )
        
        # Añadir webview al layout
        layout.add_widget(self.webview)
        
        # Programar verificación de carga
        Clock.schedule_once(self.check_load, 2)
        
        return layout
    
    def get_local_url(self):
        """Obtener URL local de la aplicación web"""
        if platform == 'android':
            # En Android, los archivos se encuentran en el directorio de la aplicación
            return 'file:///android_asset/mobile/index.html'
        else:
            # En desarrollo, usar la ruta relativa
            base_dir = os.path.dirname(os.path.abspath(__file__))
            return f'file://{os.path.join(base_dir, "mobile", "index.html")}'
    
    def check_load(self, dt):
        """Verificar si la página se cargó correctamente"""
        # Ejecutar JavaScript para verificar si la página se cargó
        self.webview.evaluate_javascript(
            'document.readyState',
            self.on_js_complete
        )
    
    def on_js_complete(self, result):
        """Callback cuando se completa la ejecución de JavaScript"""
        if result != 'complete':
            # Si la página no se cargó completamente, intentar de nuevo
            Clock.schedule_once(self.check_load, 1)
        else:
            print("Aplicación web cargada correctamente")
            # Inicializar la aplicación web
            self.init_web_app()
    
    def init_web_app(self):
        """Inicializar la aplicación web"""
        # Ejecutar JavaScript para configurar la aplicación
        js_code = """
        // Verificar si CONFIG ya está definido
        if (typeof CONFIG === 'undefined') {
            // Definir CONFIG si no existe
            window.CONFIG = {
                API_URL: 'http://192.168.100.12:5001',
                TOKEN_EXPIRY: 86400000,
                TOAST_DURATION: 3000,
                MAX_FILE_SIZE: 5242880,
                ALLOWED_FILE_EXTENSIONS: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'],
                USER_TYPES: ['docente', 'pensionado', 'beneficiario'],
                QUEJA_STATES: {
                    PENDIENTE: 'Pendiente',
                    EN_PROCESO: 'En proceso',
                    RESUELTA: 'Resuelta',
                    RECHAZADA: 'Rechazada'
                },
                APP_VERSION: '1.0.0',
                IS_MOBILE_APP: true
            };
        } else {
            // Asegurar que estamos en modo app móvil
            CONFIG.IS_MOBILE_APP = true;
        }
        
        // Notificar que estamos en la app móvil
        if (window.app) {
            window.app.showToast('Aplicación móvil iniciada', 'success');
        }
        """
        self.webview.evaluate_javascript(js_code)

if __name__ == '__main__':
    WebViewApp().run()
