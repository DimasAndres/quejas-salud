import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationToastProps {
  isVisible: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function NotificationToast({ 
  isVisible, 
  title, 
  message, 
  type = "success", 
  onClose,
  autoClose = true,
  duration = 5000
}: NotificationToastProps) {
  
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "border-green-500 bg-green-50",
    error: "border-red-500 bg-red-50",
    info: "border-blue-500 bg-blue-50",
  };

  const iconColors = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
  };

  const Icon = icons[type];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-right">
      <div className={cn(
        "bg-white rounded-lg shadow-xl border-l-4 p-4",
        colors[type]
      )}>
        <div className="flex items-center space-x-3">
          <Icon className={cn("w-5 h-5 flex-shrink-0", iconColors[type])} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
