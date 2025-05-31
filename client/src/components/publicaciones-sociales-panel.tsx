import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Twitter, Facebook, Instagram, MessageCircle, Share2, Heart } from "lucide-react";
import { PublicacionSocial, PUBLICACIONES_SOCIALES } from "../data/publicacionesSociales";
import { cn } from "../lib/utils";

interface PublicacionSocialItemProps {
  publicacion: PublicacionSocial;
}

const PublicacionSocialItem: React.FC<PublicacionSocialItemProps> = ({ publicacion }) => {
  const iconMap = {
    'twitter': <Twitter className="h-4 w-4 text-blue-400" />,
    'facebook': <Facebook className="h-4 w-4 text-blue-600" />,
    'instagram': <Instagram className="h-4 w-4 text-pink-600" />
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `hace ${diffMinutes} minutos`;
      }
      return `hace ${diffHours} horas`;
    } else if (diffDays === 1) {
      return 'ayer';
    } else if (diffDays < 7) {
      return `hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="mt-1">
            {iconMap[publicacion.plataforma]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{publicacion.autor}</h4>
              <span className="text-xs text-muted-foreground">
                {formatDate(publicacion.fecha)}
              </span>
            </div>
            <p className="text-sm mt-1">{publicacion.contenido}</p>
            
            {publicacion.imagen && (
              <div className="mt-2 rounded-md overflow-hidden bg-muted/30 h-24 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">[Imagen: {publicacion.imagen}]</span>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" /> {publicacion.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" /> {publicacion.compartidos}
                </span>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                publicacion.plataforma === 'twitter' && "bg-blue-50 text-blue-600",
                publicacion.plataforma === 'facebook' && "bg-blue-100 text-blue-700",
                publicacion.plataforma === 'instagram' && "bg-pink-50 text-pink-600"
              )}>
                {publicacion.plataforma}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function PublicacionesSocialesPanel() {
  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Redes Sociales</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="px-4 pb-4">
          {PUBLICACIONES_SOCIALES.map((publicacion) => (
            <PublicacionSocialItem key={publicacion.id} publicacion={publicacion} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
