import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShieldX, Mail, Phone, Megaphone, Smartphone } from "lucide-react";

interface VeedoresProps {
  onBack: () => void;
}

const veedores = [
  {
    id: 1,
    name: "Dimas Andrés Arias Núnez",
    position: "Veedor Nacional",
    region: "Quindío",
    email: "dimasveedurianacional@gmail.com",
    phone: "3146761550"
  },
  {
    id: 2,
    name: "Manuel Andrés Viloria",
    position: "Veedor Regional Antioquia",
    region: "Responsable de supervisar los servicios de salud en la región de Antioquia",
    email: "juan.perez@veeduria.gov.co",
    phone: "+57 300 123 4567"
  },
  {
    id: 3,
    name: "Jorge Acosta",
    position: "Veedor Regional Valle del Cauca",
    region: "Supervisión y control de servicios de salud en Valle del Cauca",
    email: "carlos.rodriguez@veeduria.gov.co",
    phone: "+57 300 456 7890"
  },
  {
    id: 4,
    name: "Ana Martínez",
    position: "Veedora Regional Atlántico",
    region: "Monitoreo y seguimiento de quejas en la región Atlántico",
    email: "ana.martinez@veeduria.gov.co",
    phone: "+57 300 234 5678"
  },
  {
    id: 5,
    name: "Luis Hernández",
    position: "Veedor Regional Cundinamarca",
    region: "Gestión de veeduría en Cundinamarca y alrededores de Bogotá",
    email: "luis.hernandez@veeduria.gov.co",
    phone: "+57 300 345 6789"
  },
  {
    id: 6,
    name: "Patricia Silva",
    position: "Veedora Regional Santander",
    region: "Supervisión de servicios de salud en el departamento de Santander",
    email: "patricia.silva@veeduria.gov.co",
    phone: "+57 300 567 8901"
  }
];

export function Veedores({ onBack }: VeedoresProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Lista de Veedores</h2>
          <p className="text-muted-foreground mt-2">Veedores activos supervisando el sistema de salud nacional</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {veedores.map((veedor) => (
          <Card key={veedor.id} className="border-l-4 border-orange-500">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldX className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{veedor.name}</h3>
                  <p className="text-orange-500 font-medium text-sm">{veedor.position}</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    {veedor.region}
                  </p>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="w-3 h-3 mr-2" />
                      <span>{veedor.email}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="w-3 h-3 mr-2" />
                      <span>{veedor.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sponsors Section */}
      <Card className="mt-12">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Megaphone className="w-5 h-5 text-primary mr-3" />
            <h3 className="font-semibold text-lg">Patrocinadores</h3>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-primary">
            <h4 className="font-semibold text-primary mb-2 flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              DESCARGA NUESTRA APP
            </h4>
            <p className="text-sm text-muted-foreground">
              Ahora puedes presentar tus quejas desde tu móvil. 
              Disponible para Android e iOS.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
