# app/gui.py
import tkinter as tk
from tkinter import messagebox, simpledialog, filedialog, Listbox, SINGLE, Frame
import os
import datetime
from core import auth, quejas, departamentos_colombia
from core import tipos_primaria, tipos_complementaria
from core.politica_datos import POLITICA_TRATAMIENTO_DATOS

class AppQuejasSalud:
    def __init__(self, root):
        self.root = root
        self.root.title("Veeduría de Salud")
        self.root.geometry("420x720")
        self.usuario_id = None
        self.main_frame = tk.Frame(self.root)
        self.main_frame.pack(fill="both", expand=True)
        self.mostrar_inicio()

    def limpiar_frame(self):
        for widget in self.main_frame.winfo_children():
            widget.destroy()

    def mostrar_inicio(self):
        self.limpiar_frame()
        
        # Contenedor principal para organizar elementos
        contenido_frame = Frame(self.main_frame)
        contenido_frame.pack(fill="both", expand=True)
        
        # Título y botones principales en la parte superior
        tk.Label(contenido_frame, text="Sistema de Quejas de Salud", font=("Arial", 16)).pack(pady=10)
        tk.Button(contenido_frame, text="Registrar usuario", command=self.mostrar_registro).pack(pady=10)
        tk.Button(contenido_frame, text="Iniciar sesión", command=self.mostrar_login).pack(pady=10)
        
        # Nuevo botón para mostrar la lista de veedores
        tk.Button(contenido_frame, text="Ver Veedores", command=self.mostrar_veedores).pack(pady=10)
        
        # Espacio flexible para empujar el contenido siguiente hacia abajo
        Frame(contenido_frame, height=20).pack(fill="both", expand=True)
        
        # Botón de salir 
        tk.Button(contenido_frame, text="Salir", command=self.root.quit).pack(pady=10)
        
        # Espacio para patrocinadores con publicidad
        patrocinadores_frame = Frame(contenido_frame, bg="#f0f0f0", padx=10, pady=10)
        patrocinadores_frame.pack(fill="x", pady=5)
        
        tk.Label(patrocinadores_frame, text="🔷 Patrocinadores", 
                 font=("Arial", 12, "bold"), fg="blue", bg="#f0f0f0").pack(anchor="w")
        
        # Publicidad de la veeduría
        publicidad_frame = Frame(patrocinadores_frame, bg="#e6f2ff", relief="ridge", bd=1)
        publicidad_frame.pack(fill="x", pady=5)
        
        tk.Label(publicidad_frame, 
                 text="📢 ¡CONOCE TUS DERECHOS EN SALUD!",
                 font=("Arial", 11, "bold"), bg="#e6f2ff").pack(anchor="w", padx=5, pady=3)
        
        tk.Label(publicidad_frame, 
                 text="La Veeduría Nacional de Salud te invita a nuestros\n"
                      "talleres gratuitos sobre derechos y deberes en salud.\n"
                      "Inscripciones en: www.veedurianacionaldesalud.gov.co",
                 font=("Arial", 9), justify="left", bg="#e6f2ff").pack(anchor="w", padx=5, pady=3)

    def mostrar_veedores(self):
        """Muestra la lista de veedores"""
        self.limpiar_frame()
        
        tk.Label(self.main_frame, text="Lista de Veedores", font=("Arial", 14, "bold")).pack(pady=10)
        
        # Lista de veedores (puedes modificar esta lista según sea necesario)
        veedores = [
            "Juan Pérez - Veedor Regional Antioquia",
            "María González - Veedora Nacional",
            "Carlos Rodríguez - Veedor Regional Valle del Cauca",
            "Ana Martínez - Veedora Regional Atlántico",
            "Luis Hernández - Veedor Regional Cundinamarca"
        ]
        
        # Crear un frame para la lista
        frame_lista = Frame(self.main_frame)
        frame_lista.pack(fill="both", expand=True, padx=20, pady=10)
        
        # Mostrar cada veedor en una etiqueta separada
        for veedor in veedores:
            tk.Label(frame_lista, text=f"• {veedor}", anchor="w", pady=5).pack(fill="x")
        
        # Botón para volver
        tk.Button(self.main_frame, text="Volver al inicio", command=self.mostrar_inicio).pack(pady=10)
        
        # Espacio para patrocinadores
        patrocinadores_frame = Frame(self.main_frame, bg="#f0f0f0", padx=10, pady=10)
        patrocinadores_frame.pack(fill="x", side="bottom")
        
        tk.Label(patrocinadores_frame, text="🔷 Patrocinadores", 
                 font=("Arial", 12, "bold"), fg="blue", bg="#f0f0f0").pack(anchor="w")
        
        # Publicidad de la veeduría
        publicidad_frame = Frame(patrocinadores_frame, bg="#e6f2ff", relief="ridge", bd=1)
        publicidad_frame.pack(fill="x", pady=5)
        
        tk.Label(publicidad_frame, 
                 text="📱 DESCARGA NUESTRA APP",
                 font=("Arial", 11, "bold"), bg="#e6f2ff").pack(anchor="w", padx=5, pady=3)
        
        tk.Label(publicidad_frame, 
                 text="Ahora puedes presentar tus quejas desde tu móvil.\n"
                      "Disponible para Android e iOS.",
                 font=("Arial", 9), justify="left", bg="#e6f2ff").pack(anchor="w", padx=5, pady=3)

    def mostrar_politica_datos(self):
        """Muestra la política de tratamiento de datos y solicita aceptación"""
        # Crear ventana modal
        politica_window = tk.Toplevel(self.root)
        politica_window.title("Política de Tratamiento de Datos Personales")
        politica_window.geometry("600x500")
        politica_window.resizable(True, True)
        
        # Hacer la ventana modal (bloquear ventana principal)
        politica_window.grab_set()
        
        # Centrar la ventana
        politica_window.transient(self.root)
        
        # Título de la ventana
        titulo_frame = tk.Frame(politica_window)
        titulo_frame.pack(fill="x", padx=10, pady=5)
        
        tk.Label(titulo_frame, 
                 text="Política de Tratamiento de Datos Personales", 
                 font=("Arial", 12, "bold")).pack()
        
        tk.Label(titulo_frame, 
                 text="Por favor lea cuidadosamente antes de continuar", 
                 font=("Arial", 9), fg="gray").pack()
        
        # Frame para el texto con scroll
        texto_frame = tk.Frame(politica_window)
        texto_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Scrollbar vertical
        scrollbar = tk.Scrollbar(texto_frame)
        scrollbar.pack(side="right", fill="y")
        
        # Área de texto
        texto_widget = tk.Text(texto_frame, 
                              wrap="word", 
                              yscrollcommand=scrollbar.set,
                              font=("Arial", 9),
                              state="normal")
        
        # Insertar el texto de la política
        texto_widget.insert("1.0", POLITICA_TRATAMIENTO_DATOS)
        texto_widget.config(state="disabled")  # Hacer de solo lectura
        texto_widget.pack(side="left", fill="both", expand=True)
        
        scrollbar.config(command=texto_widget.yview)
        
        # Variable para almacenar la respuesta del usuario
        respuesta_usuario = {"aceptada": None}
        
        # Funciones para los botones
        def aceptar_politica():
            respuesta_usuario["aceptada"] = True
            politica_window.destroy()
        
        def rechazar_politica():
            respuesta_usuario["aceptada"] = False
            politica_window.destroy()
        
        # Frame para botones
        botones_frame = tk.Frame(politica_window)
        botones_frame.pack(fill="x", padx=10, pady=10)
        
        # Mensaje de advertencia
        tk.Label(botones_frame, 
                 text="⚠️ Es obligatorio aceptar la política para usar este servicio", 
                 font=("Arial", 9), fg="red").pack(pady=5)
        
        # Botones
        botones_container = tk.Frame(botones_frame)
        botones_container.pack()
        
        tk.Button(botones_container, 
                  text="✅ Acepto la Política", 
                  command=aceptar_politica,
                  bg="#4CAF50", fg="white",
                  font=("Arial", 10, "bold"),
                  padx=20, pady=5).pack(side="left", padx=10)
        
        tk.Button(botones_container, 
                  text="❌ No Acepto", 
                  command=rechazar_politica,
                  bg="#f44336", fg="white",
                  font=("Arial", 10, "bold"),
                  padx=20, pady=5).pack(side="left", padx=10)
        
        # Centrar la ventana en la pantalla
        politica_window.update_idletasks()
        x = (politica_window.winfo_screenwidth() // 2) - (politica_window.winfo_width() // 2)
        y = (politica_window.winfo_screenheight() // 2) - (politica_window.winfo_height() // 2)
        politica_window.geometry(f"+{x}+{y}")
        
        # Esperar hasta que el usuario tome una decisión
        self.root.wait_window(politica_window)
        
        return respuesta_usuario["aceptada"]

    def mostrar_registro(self):
        """Función modificada para incluir aceptación de política"""
        # Solicitar datos del usuario
        nombre = simpledialog.askstring("Registro", "Nombre:")
        if not nombre: 
            return  # Usuario canceló
        
        apellido = simpledialog.askstring("Registro", "Apellido:")
        if not apellido: 
            return
        
        cedula = simpledialog.askstring("Registro", "Cédula:")
        if not cedula: 
            return
        
        celular = simpledialog.askstring("Registro", "Celular:")
        if not celular: 
            return
        
        correo = simpledialog.askstring("Registro", "Correo electrónico:")
        if not correo: 
            return
        
        clave = simpledialog.askstring("Registro", "Clave:", show="*")
        if not clave: 
            return
        
        tipo_usuario = simpledialog.askstring("Registro", "Tipo de usuario (docente, pensionado o beneficiario):")
        if not tipo_usuario: 
            return

        # Verificar que todos los campos estén completos
        if not all([nombre, apellido, cedula, celular, clave, tipo_usuario, correo]):
            messagebox.showerror("Registro", "Todos los campos son obligatorios.")
            return

        # Mostrar política y solicitar aceptación
        messagebox.showinfo("Política de Datos", 
                           "Antes de completar su registro, debe leer y aceptar nuestra Política de Tratamiento de Datos Personales.")
        
        acepta_politica = self.mostrar_politica_datos()
        
        if acepta_politica is None:
            # Usuario cerró la ventana sin decidir
            messagebox.showwarning("Registro cancelado", 
                                  "El registro ha sido cancelado. Debe aceptar la política para continuar.")
            return
        
        if not acepta_politica:
            # Usuario rechazó la política
            messagebox.showinfo("Registro no completado", 
                               "No es posible completar el registro sin aceptar la Política de Tratamiento de Datos Personales.\n\n"
                               "Sin su consentimiento, no podemos recopilar ni procesar sus datos personales según lo requiere la Ley 1581 de 2012.")
            return

        # Usuario aceptó la política, proceder con el registro
        try:
            ok, msg = auth.registrar_usuario(
                nombre, apellido, cedula, celular, clave, tipo_usuario, correo,
                acepta_politica=True
            )
            
            if ok:
                messagebox.showinfo("Registro Exitoso", 
                                   f"{msg}\n\nSu aceptación de la Política de Tratamiento de Datos ha sido registrada correctamente.")
            else:
                messagebox.showerror("Error en el Registro", f"Error: {msg}")
                
        except Exception as e:
            messagebox.showerror("Error", f"Error inesperado durante el registro: {e}")

    def verificar_politica_usuario_existente(self):
        """Verifica si un usuario existente ha aceptado la política"""
        try:
            ha_aceptado, fecha_aceptacion = auth.verificar_politica_usuario(self.usuario_id)
            
            if not ha_aceptado:
                # Usuario no ha aceptado la política, mostrar ventana de solicitud
                return self.solicitar_aceptacion_politica_existente()
            
            return True
            
        except Exception as e:
            messagebox.showerror("Error", f"Error al verificar política: {e}")
            return False

    def solicitar_aceptacion_politica_existente(self):
        """Solicita a un usuario existente que acepte la política"""
        messagebox.showinfo(
            "Política de Tratamiento de Datos",
            "Para continuar usando nuestros servicios, debe aceptar nuestra "
            "Política de Tratamiento de Datos Personales actualizada según "
            "la Ley 1581 de 2012."
        )
        
        acepta_politica = self.mostrar_politica_datos()
        
        if acepta_politica is None or not acepta_politica:
            messagebox.showwarning(
                "Acceso Denegado",
                "No puede acceder al sistema sin aceptar la Política de "
                "Tratamiento de Datos Personales.\n\n"
                "Su sesión será cerrada."
            )
            self.usuario_id = None
            self.mostrar_inicio()
            return False
        
        # Usuario aceptó, actualizar en la base de datos
        try:
            exito, mensaje = auth.actualizar_aceptacion_politica(self.usuario_id, True)
            
            if exito:
                messagebox.showinfo(
                    "Política Aceptada",
                    "Gracias por aceptar nuestra Política de Tratamiento de Datos.\n"
                    "Ahora puede continuar usando el sistema."
                )
                return True
            else:
                messagebox.showerror("Error", f"Error al actualizar política: {mensaje}")
                return False
                
        except Exception as e:
            messagebox.showerror("Error", f"Error inesperado: {e}")
            return False

    def mostrar_login(self):
        cedula = simpledialog.askstring("Login", "Cédula:")
        clave = simpledialog.askstring("Login", "Clave:", show="*")
        if cedula and clave:
            uid, msg = auth.login_usuario(cedula, clave)
            if uid:
                self.usuario_id = uid
                messagebox.showinfo("Bienvenido", msg)
                
                # Verificar si el usuario ha aceptado la política (para usuarios existentes)
                if self.verificar_politica_usuario_existente():
                    self.mostrar_menu_usuario()
                # Si no acepta la política, verificar_politica_usuario_existente ya maneja el flujo
            else:
                messagebox.showerror("Error", msg)

    def mostrar_revocacion_consentimiento(self):
        """Muestra advertencia y solicita confirmación para revocar el consentimiento"""
        # Crear ventana de advertencia personalizada
        revocacion_window = tk.Toplevel(self.root)
        revocacion_window.title("Revocar Consentimiento de Datos")
        revocacion_window.geometry("500x400")
        revocacion_window.resizable(False, False)
        
        # Hacer la ventana modal
        revocacion_window.grab_set()
        revocacion_window.transient(self.root)
        
        # Centrar la ventana
        revocacion_window.update_idletasks()
        x = (revocacion_window.winfo_screenwidth() // 2) - (revocacion_window.winfo_width() // 2)
        y = (revocacion_window.winfo_screenheight() // 2) - (revocacion_window.winfo_height() // 2)
        revocacion_window.geometry(f"+{x}+{y}")
        
        # Título
        titulo_frame = Frame(revocacion_window, bg="#ffebee")
        titulo_frame.pack(fill="x", padx=10, pady=10)
        
        tk.Label(titulo_frame, 
                 text="⚠️ REVOCAR CONSENTIMIENTO DE DATOS",
                 font=("Arial", 14, "bold"), 
                 fg="#d32f2f", bg="#ffebee").pack()
        
        # Contenido de advertencia
        contenido_frame = Frame(revocacion_window)
        contenido_frame.pack(fill="both", expand=True, padx=20, pady=10)
        
        advertencia_text = """ADVERTENCIA IMPORTANTE:

Al revocar su consentimiento para el tratamiento de datos personales:

• Su cuenta será eliminada PERMANENTEMENTE
• Todas sus quejas registradas serán eliminadas
• No podrá recuperar esta información posteriormente
• Deberá registrarse nuevamente si desea usar el servicio

CONSECUENCIAS LEGALES:
Según la Ley 1581 de 2012, usted tiene derecho a revocar la autorización 
para el tratamiento de sus datos personales. Sin embargo, esto implica 
que no podremos continuar prestándole nuestros servicios.

¿Está COMPLETAMENTE SEGURO de que desea continuar?"""
        
        tk.Label(contenido_frame, 
                 text=advertencia_text,
                 font=("Arial", 10),
                 justify="left",
                 wraplength=450).pack(pady=10)
        
        # Variable para la respuesta
        respuesta = {"confirma": None}
        
        def confirmar_revocacion():
            respuesta["confirma"] = True
            revocacion_window.destroy()
        
        def cancelar_revocacion():
            respuesta["confirma"] = False
            revocacion_window.destroy()
        
        # Frame para botones
        botones_frame = Frame(revocacion_window)
        botones_frame.pack(fill="x", padx=20, pady=20)
        
        tk.Button(botones_frame,
                  text="❌ SÍ, REVOCAR CONSENTIMIENTO",
                  command=confirmar_revocacion,
                  bg="#d32f2f", fg="white",
                  font=("Arial", 11, "bold"),
                  padx=20, pady=10).pack(side="left", padx=10)
        
        tk.Button(botones_frame,
                  text="✅ CANCELAR (Mantener cuenta)",
                  command=cancelar_revocacion,
                  bg="#388e3c", fg="white",
                  font=("Arial", 11, "bold"),
                  padx=20, pady=10).pack(side="right", padx=10)
        
        # Esperar respuesta del usuario
        self.root.wait_window(revocacion_window)
        
        if respuesta["confirma"]:
            # Proceder con la eliminación
            self.procesar_revocacion_consentimiento()

    def procesar_revocacion_consentimiento(self):
        """Procesa la revocación del consentimiento eliminando la cuenta"""
        try:
            # Eliminar la cuenta del usuario
            exito, mensaje = auth.eliminar_usuario(self.usuario_id)
            
            if exito:
                messagebox.showinfo(
                    "Consentimiento Revocado",
                    "Su consentimiento ha sido revocado exitosamente.\n\n"
                    "Su cuenta y todos los datos asociados han sido eliminados "
                    "del sistema conforme a la Ley 1581 de 2012.\n\n"
                    "Gracias por haber utilizado nuestros servicios."
                )
                
                # Limpiar sesión y volver al inicio
                self.usuario_id = None
                self.mostrar_inicio()
            else:
                messagebox.showerror(
                    "Error",
                    f"No se pudo procesar la revocación: {mensaje}\n\n"
                    "Por favor contacte al administrador del sistema."
                )
                
        except Exception as e:
            messagebox.showerror(
                "Error Inesperado",
                f"Ocurrió un error inesperado: {e}\n\n"
                "Por favor contacte al administrador del sistema."
            )

    def mostrar_info_politica_usuario(self):
        """Muestra información sobre la política del usuario actual"""
        try:
            info_usuario = auth.obtener_info_usuario(self.usuario_id)
            if not info_usuario:
                messagebox.showerror("Error", "No se pudo obtener información del usuario")
                return
            
            # Crear ventana de información
            info_window = tk.Toplevel(self.root)
            info_window.title("Información de Política de Datos")
            info_window.geometry("450x300")
            info_window.resizable(False, False)
            
            info_window.grab_set()
            info_window.transient(self.root)
            
            # Centrar ventana
            info_window.update_idletasks()
            x = (info_window.winfo_screenwidth() // 2) - (info_window.winfo_width() // 2)
            y = (info_window.winfo_screenheight() // 2) - (info_window.winfo_height() // 2)
            info_window.geometry(f"+{x}+{y}")
            
            # Título
            tk.Label(info_window, 
                     text="📋 Información de Política de Datos",
                     font=("Arial", 14, "bold")).pack(pady=10)
            
            # Información del usuario
            info_frame = Frame(info_window)
            info_frame.pack(fill="both", expand=True, padx=20, pady=10)
            
            fecha_aceptacion = info_usuario['fecha_aceptacion']
            fecha_str = fecha_aceptacion.strftime("%d/%m/%Y %H:%M:%S") if fecha_aceptacion else "No disponible"
            
            info_text = f"""Usuario: {info_usuario['nombre']} {info_usuario['apellido']}
Cédula: {info_usuario['cedula']}
Tipo: {info_usuario['tipo_usuario']}

ESTADO DE POLÍTICA DE DATOS:
✅ Política aceptada: {'Sí' if info_usuario['acepto_politica'] else 'No'}
📅 Fecha de aceptación: {fecha_str}

Sus derechos como titular de datos:
• Conocer y actualizar sus datos
• Solicitar supresión de datos
• Revocar autorización
• Presentar quejas ante la SIC"""
            
            tk.Label(info_frame,
                     text=info_text,
                     font=("Arial", 10),
                     justify="left").pack(pady=10)
            
            # Botones
            botones_frame = Frame(info_window)
            botones_frame.pack(fill="x", pady=10)
            
            tk.Button(botones_frame,
                      text="Ver Política Completa",
                      command=lambda: self.mostrar_politica_datos(),
                      bg="#2196F3", fg="white",
                      font=("Arial", 10)).pack(side="left", padx=20)
            
            tk.Button(botones_frame,
                      text="Cerrar",
                      command=info_window.destroy,
                      bg="#757575", fg="white",
                      font=("Arial", 10)).pack(side="right", padx=20)
            
        except Exception as e:
            messagebox.showerror("Error", f"Error al mostrar información: {e}")

    def mostrar_menu_usuario(self):
        self.limpiar_frame()
        
        # Contenedor principal para organizar elementos
        contenido_frame = Frame(self.main_frame)
        contenido_frame.pack(fill="both", expand=True)
        
        tk.Label(contenido_frame, text="Menú del Usuario", font=("Arial", 14)).pack(pady=10)
        tk.Button(contenido_frame, text="Registrar queja de Atención Primaria", 
                command=lambda: self.mostrar_formulario_queja("Primaria")).pack(pady=10)
        tk.Button(contenido_frame, text="Registrar queja de Atención Complementaria", 
                command=lambda: self.mostrar_formulario_queja("Complementaria")).pack(pady=10)
        
        # Botón para ver veedores
        tk.Button(contenido_frame, text="Ver Veedores", command=self.mostrar_veedores).pack(pady=10)
        
        # Separador
        tk.Label(contenido_frame, text="────────────────────", fg="gray").pack(pady=5)
        
        # Nuevas opciones relacionadas con política de datos
        tk.Button(contenido_frame, 
                  text="📋 Ver Información de Política de Datos",
                  command=self.mostrar_info_politica_usuario,
                  fg="blue").pack(pady=5)
        
        tk.Button(contenido_frame, 
                  text="⚠️ Revocar Consentimiento de Datos",
                  command=self.mostrar_revocacion_consentimiento,
                  fg="red").pack(pady=5)
        
        # Espacio flexible
        Frame(contenido_frame, height=20).pack(fill="both", expand=True)
        
        # Cerrar sesión
        tk.Button(contenido_frame, text="Cerrar sesión", command=self.mostrar_inicio).pack(pady=10)
        
        # Espacio para patrocinadores
        patrocinadores_frame = Frame(contenido_frame, bg="#f0f0f0", padx=10, pady=10)
        patrocinadores_frame.pack(fill="x")
        
        tk.Label(patrocinadores_frame, text="🔷 Patrocinadores", 
                 font=("Arial", 12, "bold"), fg="blue", bg="#f0f0f0").pack(anchor="w")
        
        # Publicidad de la veeduría
        publicidad_frame = Frame(patrocinadores_frame, bg="#e6f2ff", relief="ridge", bd=1)
        publicidad_frame.pack(fill="x", pady=5)
        
        tk.Label(publicidad_frame, 
                 text="🔊 ¡LÍNEA DE ATENCIÓN 24/7!",
                 font=("Arial", 11, "bold"), bg="#e6f2ff").pack(anchor="w", padx=5, pady=3)
        
        tk.Label(publicidad_frame, 
                 text="Comunícate con nuestra línea gratuita 01-8000-123456\n"
                      "para asesoría en temas de salud y derechos del paciente.",
                 font=("Arial", 9), justify="left", bg="#e6f2ff").pack(anchor="w", padx=5, pady=3)

    def mostrar_formulario_queja(self, clasificacion):
        self.limpiar_frame()
        archivos_soporte = []

        # Contenedor con scroll
        canvas = tk.Canvas(self.main_frame)
        scrollbar = tk.Scrollbar(self.main_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas)
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        tipos_lista = tipos_primaria.TIPOS_PRIMARIA if clasificacion == "Primaria" else tipos_complementaria.TIPOS_COMPLEMENTARIA
        tipo_var = tk.StringVar(value=tipos_lista[0])

        para_beneficiario = tk.BooleanVar()
        tk.Checkbutton(scrollable_frame, text="¿Es para un beneficiario?", variable=para_beneficiario).pack(pady=5)

        tk.Label(scrollable_frame, text=f"Tipo de queja ({clasificacion}):").pack()
        tk.OptionMenu(scrollable_frame, tipo_var, *tipos_lista).pack()

        depto_var = tk.StringVar(value="Amazonas")
        muni_var = tk.StringVar()

        tk.Label(scrollable_frame, text="Departamento:").pack()
        tk.OptionMenu(scrollable_frame, depto_var, *departamentos_colombia.DEPARTAMENTOS.keys()).pack()

        def actualizar_municipios(*args):
            municipios = departamentos_colombia.DEPARTAMENTOS.get(depto_var.get(), [])
            muni_var.set(municipios[0] if municipios else "")
            menu_muni['menu'].delete(0, "end")
            for m in municipios:
                menu_muni['menu'].add_command(label=m, command=lambda v=m: muni_var.set(v))

        depto_var.trace('w', actualizar_municipios)
        tk.Label(scrollable_frame, text="Municipio:").pack()
        menu_muni = tk.OptionMenu(scrollable_frame, muni_var, "")
        menu_muni.pack()
        actualizar_municipios()

        tk.Label(scrollable_frame, text="Detalle de la queja:").pack()
        detalle_txt = tk.Text(scrollable_frame, height=6, width=45)
        detalle_txt.pack()

        # Frame para archivos adjuntos
        archivos_frame = tk.Frame(scrollable_frame)
        archivos_frame.pack(pady=5, fill="both")
        
        tk.Label(archivos_frame, text="Archivos adjuntos:").pack(anchor="w")
        
        # Lista para mostrar archivos adjuntos
        lista_archivos = Listbox(archivos_frame, width=45, height=3, selectmode=SINGLE)
        lista_archivos.pack(fill="both", expand=True)

        def adjuntar_archivo():
            archivo = filedialog.askopenfilename()
            if archivo:
                archivos_soporte.append(archivo)
                # Mostrar solo el nombre del archivo, no la ruta completa
                nombre_archivo = os.path.basename(archivo)
                lista_archivos.insert(tk.END, nombre_archivo)
                messagebox.showinfo("Archivo", "Adjunto correctamente.")

        def eliminar_archivo():
            seleccion = lista_archivos.curselection()
            if seleccion:
                indice = seleccion[0]
                if 0 <= indice < len(archivos_soporte):
                    archivo_eliminado = archivos_soporte.pop(indice)
                    lista_archivos.delete(indice)
                    messagebox.showinfo("Archivo", f"Se eliminó: {os.path.basename(archivo_eliminado)}")

        # Frame para botones de archivos
        botones_archivo = tk.Frame(archivos_frame)
        botones_archivo.pack(fill="x")
        
        tk.Button(botones_archivo, text="📎 Adjuntar", command=adjuntar_archivo).pack(side="left", padx=5, pady=5)
        tk.Button(botones_archivo, text="🗑️ Eliminar", command=eliminar_archivo).pack(side="left", padx=5, pady=5)

        # Botones de acción
        botones_frame = tk.Frame(scrollable_frame)
        botones_frame.pack(fill="x", pady=10)
        
        def enviar():
            detalle = detalle_txt.get("1.0", "end").strip()
            mensaje = quejas.registrar_queja(
                usuario_id=self.usuario_id,
                problema=tipo_var.get(),
                detalle=detalle,
                ciudad=muni_var.get(),
                departamento=depto_var.get(),
                clasificacion=clasificacion,
                soporte=archivos_soporte,
                para_beneficiario=para_beneficiario.get()
            )
            messagebox.showinfo("Resultado", mensaje)
            self.mostrar_menu_usuario()
        
        # Botón de enviar y volver
        tk.Button(botones_frame, text="Enviar queja", command=enviar).pack(side="left", padx=5, pady=5)
        tk.Button(botones_frame, text="Volver", command=self.mostrar_menu_usuario).pack(side="left", padx=5, pady=5)
        
        # Espacio para patrocinadores
        patrocinadores_frame = Frame(scrollable_frame, bg="#f0f0f0", padx=10, pady=10)
        patrocinadores_frame.pack(fill="x", pady=10)
        
        tk.Label(patrocinadores_frame, text="🔷 Patrocinadores", 
                 font=("Arial", 12, "bold"), fg="blue", bg="#f0f0f0").pack(anchor="w")
        
        # Publicidad de la veeduría
        publicidad_frame = Frame(patrocinadores_frame, bg="#e6f2ff", relief="ridge", bd=1)
        publicidad_frame.pack(fill="x", pady=5)
        
        tk.Label(publicidad_frame, 
                 text="🏥 CAMPAÑA: SALUD PARA TODOS",
                 font=("Arial", 11, "bold"), bg="#e6f2ff").pack(anchor="w", padx=5, pady=3)
        
        tk.Label(publicidad_frame, 
                 text="Conoce tus derechos y ayúdanos a mejorar\n"
                      "el sistema de salud. ¡Tu voz es importante!",
                 font=("Arial", 9), justify="left", bg="#e6f2ff").pack(anchor="w", padx=5, pady=3)

def iniciar_interfaz():
    root = tk.Tk()
    app = AppQuejasSalud(root)
    root.mainloop()