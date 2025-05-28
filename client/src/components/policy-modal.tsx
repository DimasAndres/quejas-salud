import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export function PolicyModal({ isOpen, onClose, onAccept, onReject }: PolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Política de Tratamiento de Datos Personales
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Por favor lee cuidadosamente antes de continuar
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 text-sm">
            <section>
              <h4 className="font-semibold text-primary mb-3">1. INTRODUCCIÓN</h4>
              <p className="mb-4">
                La Veeduría Nacional de Salud, en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, 
                informa a los usuarios del sistema de quejas de salud la presente política de tratamiento de datos personales.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-primary mb-3">2. RESPONSABLE DEL TRATAMIENTO</h4>
              <div className="space-y-1">
                <p><strong>Nombre:</strong> Veeduría Nacional de Salud de Colombia</p>
                <p><strong>Dirección:</strong> Calle Principal #123, Bogotá D.C.</p>
                <p><strong>Correo electrónico:</strong> veedurianacionalsaludmagcol@gmail.com</p>
                <p><strong>Teléfono:</strong> (+57) 601-1234567</p>
              </div>
            </section>

            <section>
              <h4 className="font-semibold text-primary mb-3">3. FINALIDAD DEL TRATAMIENTO</h4>
              <p className="mb-2">Los datos personales recolectados serán utilizados para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Registro y gestión de quejas relacionadas con el sistema de salud</li>
                <li>Seguimiento a las quejas presentadas ante las entidades correspondientes</li>
                <li>Comunicación con entidades de salud y organismos de control</li>
                <li>Generación de estadísticas e informes para mejorar el sistema de salud</li>
                <li>Contacto directo con el usuario para actualización o seguimiento de casos</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-primary mb-3">4. DERECHOS DEL TITULAR</h4>
              <p className="mb-2">Como titular de los datos, usted tiene derecho a:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Conocer, actualizar y rectificar sus datos personales</li>
                <li>Solicitar prueba de la autorización otorgada</li>
                <li>Ser informado sobre el uso que se ha dado a sus datos</li>
                <li>Presentar quejas ante la Superintendencia de Industria y Comercio</li>
                <li>Revocar la autorización y solicitar la supresión del dato cuando no se respeten los principios, derechos y garantías constitucionales</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-primary mb-3">5. MECANISMOS PARA EJERCER DERECHOS</h4>
              <div className="space-y-2">
                <p>Los titulares pueden ejercer sus derechos mediante:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Solicitud escrita al correo electrónico: veedurianacionalsaludmagcol@gmail.com</li>
                  <li>Comunicación telefónica al número: (+57) 601-1234567</li>
                  <li>La solicitud deberá contener identificación del titular, descripción de los hechos y propósito de la solicitud</li>
                </ul>
              </div>
            </section>

            <section>
              <h4 className="font-semibold text-primary mb-3">6. SEGURIDAD DE LA INFORMACIÓN</h4>
              <p>
                La Veeduría Nacional de Salud implementa medidas técnicas, humanas y administrativas necesarias 
                para garantizar la seguridad de los datos personales y evitar su adulteración, pérdida o uso no autorizado.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-primary mb-3">7. VIGENCIA</h4>
              <p>
                Esta política entra en vigor a partir del 1 de enero de 2023 y estará vigente mientras exista 
                la obligación legal o contractual de conservar la información.
              </p>
            </section>

            <Alert className="border-warning bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="font-medium">
                Al aceptar esta política, usted autoriza expresamente a la Veeduría Nacional de Salud para 
                recolectar, usar y tratar sus datos personales de acuerdo con esta política de tratamiento de datos.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t pt-6">
          <Alert className="border-destructive bg-destructive/10 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="font-medium text-center">
              Es obligatorio aceptar la política para usar este servicio
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Acepto la Política
            </Button>
            <Button onClick={onReject} variant="destructive">
              <XCircle className="w-4 h-4 mr-2" />
              No Acepto
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
