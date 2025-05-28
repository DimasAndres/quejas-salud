import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ClipboardList, AlertTriangle, MapPin, FileText, Paperclip, CloudUpload, X, File, Send, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TIPOS_QUEJA } from "@/data/tiposQueja";
import { DEPARTAMENTOS, getDepartamentos, getCiudadesByDepartamento } from "@/data/departamentos";

interface ComplaintFormProps {
  onSubmit: (data: any, files?: FileList) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function ComplaintForm({ onSubmit, onBack, isLoading }: ComplaintFormProps) {
  const [formData, setFormData] = useState({
    clasificacion: "",
    problema: "",
    departamento: "",
    ciudad: "",
    detalle: "",
    paraBeneficiario: false,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Handle department change to update cities
    if (field === "departamento") {
      const newCiudades = getCiudadesByDepartamento(value);
      setCiudades(newCiudades);
      setFormData(prev => ({ ...prev, ciudad: "" })); // Reset city selection
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file size (5MB max)
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast({
        title: "Archivos muy grandes",
        description: "Algunos archivos exceden el límite de 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['clasificacion', 'problema', 'departamento', 'ciudad', 'detalle'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileList = selectedFiles.length > 0 ? (() => {
        const dt = new DataTransfer();
        selectedFiles.forEach(file => dt.items.add(file));
        return dt.files;
      })() : undefined;

      await onSubmit(formData, fileList);
    } catch (error: any) {
      toast({
        title: "Error al registrar queja",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Nueva Queja de Salud</h2>
              <p className="text-muted-foreground mt-2">Completa el formulario para registrar tu queja</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Clasificación de Atención */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <ClipboardList className="w-5 h-5 mr-3 text-primary" />
                Clasificación de Atención
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.clasificacion === "primaria" 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-primary"
                  }`}
                  onClick={() => handleInputChange("clasificacion", "primaria")}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 border-2 rounded-full ${
                      formData.clasificacion === "primaria" 
                        ? "border-primary bg-primary" 
                        : "border-gray-300"
                    }`} />
                    <div>
                      <p className="font-medium">Atención Primaria</p>
                      <p className="text-sm text-muted-foreground">Consulta general, odontología, vacunación</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.clasificacion === "complementaria" 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-primary"
                  }`}
                  onClick={() => handleInputChange("clasificacion", "complementaria")}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 border-2 rounded-full ${
                      formData.clasificacion === "complementaria" 
                        ? "border-primary bg-primary" 
                        : "border-gray-300"
                    }`} />
                    <div>
                      <p className="font-medium">Atención Complementaria</p>
                      <p className="text-sm text-muted-foreground">Especialistas, cirugías, terapias</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tipo de Problema */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3 text-warning" />
                Tipo de Problema
              </h3>
              
              <Select onValueChange={(value) => handleInputChange("problema", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de problema" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_QUEJA.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-green-600" />
                Ubicación del Problema
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select onValueChange={(value) => handleInputChange("departamento", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {getDepartamentos().map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad/Municipio</Label>
                  <Select 
                    onValueChange={(value) => handleInputChange("ciudad", value)}
                    disabled={!formData.departamento}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        formData.departamento 
                          ? "Selecciona municipio" 
                          : "Primero selecciona departamento"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {ciudades.map((ciudad) => (
                        <SelectItem key={ciudad} value={ciudad}>
                          {ciudad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Descripción Detallada */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-3 text-orange-500" />
                Descripción Detallada
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="detalle">
                  Describe tu queja de manera detallada y respetuosa
                </Label>
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
