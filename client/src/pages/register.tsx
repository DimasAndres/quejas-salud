import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, ArrowLeft, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TIPOS_USUARIO } from "@/data/tiposQueja";
import { PolicyModal } from "@/components/policy-modal";

interface RegisterProps {
  onRegister: (data: any) => Promise<void>;
  onShowLogin: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function Register({ onRegister, onShowLogin, onBack, isLoading }: RegisterProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    celular: "",
    correo: "",
    tipoUsuario: "",
    password: "",
  });
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!policyAccepted) {
      toast({
        title: "Política Requerida",
        description: "Debes aceptar la política de datos primero",
        variant: "destructive",
      });
      return;
    }

    // Validate form
    const requiredFields = Object.entries(formData);
    const emptyFields = requiredFields.filter(([_, value]) => !value);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    try {
      await onRegister(formData);
    } catch (error: any) {
      toast({
        title: "Error de registro",
        description: error.message || "Error al crear la cuenta",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePolicyAccept = () => {
    setPolicyAccepted(true);
    setShowPolicyModal(false);
    toast({
      title: "Política Aceptada",
      description: "Has aceptado la política de tratamiento de datos",
    });
  };

  const handlePolicyReject = () => {
    setPolicyAccepted(false);
    setShowPolicyModal(false);
    toast({
      title: "Política Rechazada",
      description: "No es posible continuar sin aceptar la política",
      variant: "destructive",
    });
  };

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Registro de Usuario</h2>
              <p className="text-muted-foreground mt-2">Crea tu cuenta para presentar quejas de salud</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cedula">Número de Cédula</Label>
                  <Input
                    id="cedula"
                    value={formData.cedula}
                    onChange={(e) => handleInputChange("cedula", e.target.value)}
                    placeholder="Número de identificación"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    type="tel"
                    value={formData.celular}
                    onChange={(e) => handleInputChange("celular", e.target.value)}
                    placeholder="Número de celular"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => handleInputChange("correo", e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tipoUsuario">Tipo de Usuario</Label>
                  <Select onValueChange={(value) => handleInputChange("tipoUsuario", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opción" />
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

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Crea una contraseña segura"
                    required
                  />
                </div>
              </div>

              <Alert className="border-warning bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Política de Tratamiento de Datos</p>
                    <p className="text-sm">
                      Antes de completar tu registro, debes leer y aceptar nuestra política de tratamiento de datos personales 
                      según la Ley 1581 de 2012.
                    </p>
                    <Button 
                      type="button"
                      variant="link" 
                      onClick={() => setShowPolicyModal(true)}
                      className="text-primary hover:text-primary/80 p-0 h-auto"
                    >
                      Leer Política de Datos →
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={isLoading || !policyAccepted}
              >
                {isLoading ? "Registrando..." : "Registrar Usuario"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Button variant="link" onClick={onShowLogin} className="p-0 h-auto">
                  Inicia sesión
                </Button>
              </p>
              <Button 
                variant="link" 
                onClick={onBack}
                className="mt-4 text-muted-foreground hover:text-foreground p-0 h-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        onAccept={handlePolicyAccept}
        onReject={handlePolicyReject}
      />
    </>
  );
}
