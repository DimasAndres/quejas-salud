import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { FileText, FileIcon, AlertCircle, BookOpen } from "lucide-react";
import { Documento, DOCUMENTOS_VEEDURIA } from "../data/documentosVeeduria";
import { cn } from "../lib/utils";

interface DocumentoItemProps {
  documento: Documento;
}

const DocumentoItem: React.FC<DocumentoItemProps> = ({ documento }) => {
  const iconMap = {
    'informe': <FileText className="h-4 w-4 text-blue-600" />,
    'comunicado': <AlertCircle className="h-4 w-4 text-red-600" />,
    'normativa': <FileIcon className="h-4 w-4 text-green-600" />,
    'guia': <BookOpen className="h-4 w-4 text-amber-600" />
  };

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {iconMap[documento.tipo]}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{documento.titulo}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{documento.descripcion}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {new Date(documento.fecha).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                documento.tipo === 'informe' && "bg-blue-100 text-blue-800",
                documento.tipo === 'comunicado' && "bg-red-100 text-red-800",
                documento.tipo === 'normativa' && "bg-green-100 text-green-800",
                documento.tipo === 'guia' && "bg-amber-100 text-amber-800"
              )}>
                {documento.tipo.charAt(0).toUpperCase() + documento.tipo.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function DocumentosVeeduriaPanel() {
  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Documentos de la Veeduría</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="px-4 pb-4">
          {DOCUMENTOS_VEEDURIA.map((documento) => (
            <DocumentoItem key={documento.id} documento={documento} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
