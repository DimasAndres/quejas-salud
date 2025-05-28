import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, Eye, TrendingUp, Megaphone, Smartphone } from "lucide-react";

interface WelcomeProps {
  onLogin: () => void;
  onRegister: () => void;
  onShowVeedores: () => void;
}

export function Welcome({ onLogin, onRegister, onShowVeedores }: WelcomeProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Sistema Nacional de Quejas de Salud</h2>
          <p className="text-lg mb-6 opacity-90">
            Presenta tus quejas y reclamos sobre servicios de salud de manera fácil y segura. 
            Tu voz es importante para mejorar el sistema de salud en Colombia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onLogin}
              variant="secondary" 
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Shield className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
            <Button 
              onClick={onRegister}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <FileText className="w-4 h-4 mr-2" />
              Registrar Usuario
            </Button>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-green-600">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Presenta tu Queja</h3>
            <p className="text-muted-foreground text-sm">
              Registra incidentes relacionados con servicios de salud de manera rápida y segura.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-orange-500">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Veedores Activos</h3>
            <p className="text-muted-foreground text-sm">
              Conoce a los veedores responsables de supervisar el sistema de salud en tu región.
            </p>
            <Button 
              onClick={onShowVeedores}
              variant="link" 
              className="mt-4 text-orange-500 hover:text-orange-600 p-0"
            >
              Ver Lista Completa →
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-primary">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Seguimiento</h3>
            <p className="text-muted-foreground text-sm">
              Consulta el estado y progreso de tus quejas registradas anteriormente.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sponsors Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Megaphone className="w-5 h-5 text-primary mr-3" />
            <h3 className="font-semibold text-lg">Patrocinadores</h3>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-primary">
            <h4 className="font-semibold text-primary mb-2 flex items-center">
              <Megaphone className="w-4 h-4 mr-2" />
              ¡CONOCE TUS DERECHOS EN SALUD!
            </h4>
            <p className="text-sm text-muted-foreground">
              La Veeduría Nacional de Salud te invita a nuestros talleres gratuitos sobre derechos 
              y deberes en salud. Inscripciones en:{" "}
              <span className="font-medium text-primary">www.veedurianacionaldesalud.gov.co</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
