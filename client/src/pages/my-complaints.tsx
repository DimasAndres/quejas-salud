import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Eye, Edit, Trash2, FileText, Inbox } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quejasAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface MyComplaintsProps {
  onBack: () => void;
  onShowComplaintForm: () => void;
}

export function MyComplaints({ onBack, onShowComplaintForm }: MyComplaintsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quejasData, isLoading } = useQuery({
    queryKey: ["/api/quejas"],
    queryFn: async () => {
      const response = await quejasAPI.getAll();
      return response.quejas || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => quejasAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quejas"] });
      toast({
        title: "Queja eliminada",
        description: "La queja ha sido eliminada exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la queja",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta queja?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (estado: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      "en_proceso": "default",
      "resuelto": "secondary",
      "rechazado": "destructive"
    };

    const labels: Record<string, string> = {
      "en_proceso": "En proceso",
      "resuelto": "Resuelto",
      "rechazado": "Rechazado"
    };

    return (
      <Badge variant={variants[estado] || "default"}>
        {labels[estado] || estado}
      </Badge>
    );
  };

  if (isLoading) {
    return <LoadingOverlay isVisible={true} message="Cargando tus quejas..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Mis Quejas</h2>
            <p className="text-muted-foreground mt-2">Consulta el estado de tus quejas registradas</p>
          </div>
        </div>
        
        <Button onClick={onShowComplaintForm} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Queja
        </Button>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {quejasData && quejasData.length > 0 ? (
          quejasData.map((queja: any) => (
            <Card key={queja.id} className="border-l-4 border-primary">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="font-semibold text-lg">{queja.problema}</h3>
                      {getStatusBadge(queja.estado || "en_proceso")}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ubicación</p>
                        <p className="font-medium">{queja.ciudad}, {queja.departamento}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha de registro</p>
                        <p className="font-medium">
                          {new Date(queja.createdAt).toLocaleDateString('es-CO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {queja.detalle}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver detalles
                      </Button>
                      <Button variant="link" className="text-orange-500 hover:text-orange-600 p-0 h-auto">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-destructive hover:text-destructive/80 p-0 h-auto"
                        onClick={() => handleDelete(queja.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Inbox className="w-24 h-24 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No tienes quejas registradas</h3>
              <p className="text-muted-foreground mb-6">Presenta tu primera queja para mejorar los servicios de salud</p>
              <Button onClick={onShowComplaintForm} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primera Queja
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <LoadingOverlay isVisible={deleteMutation.isPending} message="Eliminando queja..." />
    </div>
  );
}
