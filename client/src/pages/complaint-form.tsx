import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Alert, AlertDescription } from "../components/ui/alert";
import { DEPARTAMENTOS } from "../data/departamentos";
import { TIPOS_PRIMARIA, TIPOS_COMPLEMENTARIA, TIPOS_USUARIO } from "../data/tiposQueja";
import { CATEGORIAS_QUEJAS } from "../data/categoriasQuejas";
import { FileUploader } from "../components/file-uploader";
import { 
  User, 
  Building2, 
  MapPin, 
  FileText, 
  Paperclip, 
  Send, 
  Info, 
  CloudUpload, 
  File, 
  X 
} from "lucide-react";
import { api } from "../lib/api";

export function ComplaintForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [subcategorias, setSubcategorias] = useState<{id: string, nombre: string}[]>([]);
  
  const [formData, setFormData] = useState({
    tipoServicio: "Consulta médica general",
    tipoQueja: "",
    categoria: "",
    subcategoria: "",
    entidad: "",
    departamento: "",
    ciudad: "",
    detalle: "",
    paraBeneficiario: false,
  });

  // Actualizar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategoria) {
      const categoriaSeleccionada = CATEGORIAS_QUEJAS.find(cat => cat.id === selectedCategoria);
      if (categoriaSeleccionada) {
        setSubcategorias(categoriaSeleccionada.subcategorias);
        setFormData(prev => ({
          ...prev,
          categoria: categoriaSeleccionada.nombre,
          subcategoria: "" // Resetear subcategoría cuando cambia la categoría
        }));
      }
    } else {
      setSubcategorias([]);
    }
  }, [selectedCategoria]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subcategoria) {
      toast({
        title: "Error en el formulario",
        description: "Por favor selecciona una subcategoría de queja",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulación de envío (reemplazar con API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Queja registrada con éxito",
        description: "Tu queja ha sido enviada y será atendida a la brevedad.",
      });
      
      navigate("/my-complaints");
    } catch (error) {
      toast({
        title: "Error al registrar la queja",
        description: "Por favor intenta nuevamente más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card className="border-2">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-2xl flex items-center">
            <FileText className="w-6 h-6 mr-3 text-primary" />
            Formulario de Queja de Salud
          </CardTitle>
          <CardDescription>
            Completa el siguiente formulario para registrar tu queja sobre servicios de salud
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-3 text-primary" />
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input 
                    id="nombre" 
                    value={user?.name || ""} 
                    disabled 
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documento">Documento de Identidad</Label>
                  <Input 
                    id="documento" 
                    value={user?.document || ""} 
                    disabled 
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoUsuario">Tipo de Usuario</Label>
                  <Select 
                    value={user?.userType || "docente"} 
                    disabled
                  >
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_USUARIO.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Información de la Queja */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Building2 className="w-5 h-5 mr-3 text-primary" />
                Información de la Queja
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoServicio">Tipo de Servicio</Label>
                  <Select 
                    value={formData.tipoServicio} 
                    onValueChange={(value) => handleInputChange("tipoServicio", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Atención Primaria">Atención Primaria</SelectItem>
                      <SelectItem value="Atención Complementaria">Atención Complementaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entidad">Entidad de Salud</Label>
                  <Input 
                    id="entidad" 
                    placeholder="Nombre de la IPS o EPS" 
                    value={formData.entidad}
                    onChange={(e) => handleInputChange("entidad", e.target.value)}
                    required
                  />
                </div>
                
                {/* Categoría de Queja */}
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría de Queja</Label>
                  <Select 
                    value={selectedCategoria} 
                    onValueChange={setSelectedCategoria}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS_QUEJAS.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Subcategoría de Queja */}
                <div className="space-y-2">
                  <Label htmlFor="subcategoria">Subcategoría de Queja</Label>
                  <Select 
                    value={formData.subcategoria} 
                    onValueChange={(value) => handleInputChange("subcategoria", value)}
                    disabled={subcategorias.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={subcategorias.length === 0 ? "Selecciona primero una categoría" : "Selecciona una subcategoría"} />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategorias.map((subcategoria) => (
                        <SelectItem key={subcategoria.id} value={subcategoria.nombre}>
                          {subcategoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Ubicación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-primary" />
                Ubicación
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select 
                    value={formData.departamento} 
                    onValueChange={(value) => handleInputChange("departamento", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTAMENTOS.map((depto) => (
                        <SelectItem key={depto} value={depto}>
                          {depto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad o Municipio</Label>
                  <Input 
                    id="ciudad" 
                    placeholder="Nombre de la ciudad o municipio" 
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange("ciudad", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Detalles de la Queja */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-3 text-primary" />
                Detalles de la Queja
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="detalle">Descripción Detallada</Label>
                <Textarea 
                  id="detalle"
                  value={formData.detalle}
                  onChange={(e) => handleInputChange("detalle", e.target.value)}
                  rows={6}
                  placeholder="Describe qué sucedió, cuándo ocurrió, dónde fue el problema, quiénes estuvieron involucrados y cualquier otro detalle relevante..."
                  className="resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  Recuerda usar lenguaje respetuoso. El sistema filtra automáticamente contenido inapropiado.
                </p>
              </div>
            </div>
            {/* Archivos de Soporte */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Paperclip className="w-5 h-5 mr-3 text-primary" />
                Archivos de Soporte (Opcional)
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="space-y-2">
                    <CloudUpload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="font-medium">Haz clic para seleccionar archivos</p>
                    <p className="text-sm text-muted-foreground">O arrastra y suelta aquí</p>
                    <p className="text-xs text-muted-foreground">
                      Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (máximo 5MB cada uno)
                    </p>
                  </div>
                </label>
              </div>
              
              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <File className="w-4 h-4 text-primary" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Para Beneficiario */}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="paraBeneficiario"
                    checked={formData.paraBeneficiario}
                    onCheckedChange={(checked) => handleInputChange("paraBeneficiario", checked)}
                  />
                  <div>
                    <Label htmlFor="paraBeneficiario" className="font-medium cursor-pointer">
                      Esta queja es para un beneficiario
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Marca esta casilla si estás presentando la queja en nombre de otra persona (familiar, etc.)
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            {/* Submit Button */}
            <div className="border-t pt-6">
              <Button 
                type="submit" 
                className="w-full text-lg py-4" 
                disabled={isLoading}
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Registrando Queja..." : "Registrar Queja"}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-3">
                Al enviar esta queja, confirmas que la información proporcionada es veraz y aceptas 
                que será compartida con las entidades de salud correspondientes.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
