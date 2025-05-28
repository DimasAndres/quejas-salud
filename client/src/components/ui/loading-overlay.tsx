import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = "Procesando..." }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
        <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg font-semibold text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground mt-2">Por favor espera un momento</p>
      </div>
    </div>
  );
}
