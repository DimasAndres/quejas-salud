import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

// Components
import { Welcome } from "./pages/welcome";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Dashboard } from "./pages/dashboard";
import { ComplaintForm } from "./pages/complaint-form";
import { MyComplaints } from "./pages/my-complaints";
import { Veedores } from "./pages/veedores";
import { LoadingOverlay } from "./components/ui/loading-overlay";
import { NotificationToast } from "./components/ui/notification-toast";

// Hooks and API
import { useAuth } from "./hooks/useAuth";
import { quejasAPI } from "./lib/api";
import { useQuery } from "@tanstack/react-query";

type Screen = "welcome" | "login" | "register" | "dashboard" | "complaint-form" | "my-complaints" | "veedores";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    isVisible: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isVisible: false,
    title: "",
    message: "",
    type: "success"
  });

  const { user, loading: authLoading, login, register, logout, isAuthenticated } = useAuth();

  // Get user's complaints for dashboard
  const { data: quejasData } = useQuery({
    queryKey: ["/api/quejas"],
    queryFn: async () => {
      const response = await quejasAPI.getAll();
      return response.quejas || [];
    },
    enabled: isAuthenticated,
  });

  const showNotification = (title: string, message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ isVisible: true, title, message, type });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // Navigation functions
  const showScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleLogin = async (cedula: string, password: string) => {
    setIsLoading(true);
    try {
      await login(cedula, password);
      showNotification("Inicio de Sesión Exitoso", "Bienvenido al sistema");
      setCurrentScreen("dashboard");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: any) => {
    setIsLoading(true);
    try {
      await register(data);
      showNotification("Registro Exitoso", "Tu cuenta ha sido creada correctamente");
      setCurrentScreen("dashboard");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplaintSubmit = async (data: any, files?: FileList) => {
    setIsLoading(true);
    try {
      await quejasAPI.create(data, files);
      showNotification("Queja Registrada", "Tu queja ha sido enviada exitosamente");
      setCurrentScreen("dashboard");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showNotification("Sesión Cerrada", "Has cerrado sesión exitosamente");
    setCurrentScreen("welcome");
  };

  // Redirect to dashboard if authenticated and on welcome screen
  useEffect(() => {
    if (isAuthenticated && currentScreen === "welcome") {
      setCurrentScreen("dashboard");
    }
  }, [isAuthenticated, currentScreen]);

  if (authLoading) {
    return <LoadingOverlay isVisible={true} message="Cargando..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-neutral">
          
          {/* Header */}
          <header className="bg-white shadow-md border-b-2 border-primary">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-primary">Veeduría de Salud</h1>
                    <p className="text-sm text-muted-foreground">Sistema de Quejas Nacional</p>
                  </div>
                </div>
                
                {/* User Menu */}
                {isAuthenticated && user && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {user.nombre} {user.apellido}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8 max-w-4xl">
            {currentScreen === "welcome" && (
              <Welcome
                onLogin={() => showScreen("login")}
                onRegister={() => showScreen("register")}
                onShowVeedores={() => showScreen("veedores")}
              />
            )}

            {currentScreen === "login" && (
              <Login
                onLogin={handleLogin}
                onShowRegister={() => showScreen("register")}
                onBack={() => showScreen("welcome")}
                isLoading={isLoading}
              />
            )}

            {currentScreen === "register" && (
              <Register
                onRegister={handleRegister}
                onShowLogin={() => showScreen("login")}
                onBack={() => showScreen("welcome")}
                isLoading={isLoading}
              />
            )}

            {currentScreen === "dashboard" && isAuthenticated && (
              <Dashboard
                user={user}
                onShowComplaintForm={() => showScreen("complaint-form")}
                onShowMyComplaints={() => showScreen("my-complaints")}
                onShowVeedores={() => showScreen("veedores")}
                onLogout={handleLogout}
                recentComplaints={quejasData?.slice(0, 3) || []}
              />
            )}

            {currentScreen === "complaint-form" && isAuthenticated && (
              <ComplaintForm
                onSubmit={handleComplaintSubmit}
                onBack={() => showScreen("dashboard")}
                isLoading={isLoading}
              />
            )}

            {currentScreen === "my-complaints" && isAuthenticated && (
              <MyComplaints
                onBack={() => showScreen("dashboard")}
                onShowComplaintForm={() => showScreen("complaint-form")}
              />
            )}

            {currentScreen === "veedores" && (
              <Veedores
                onBack={() => showScreen(isAuthenticated ? "dashboard" : "welcome")}
              />
            )}
          </main>
        </div>

        <LoadingOverlay isVisible={isLoading} />
        <NotificationToast
          isVisible={notification.isVisible}
          title={notification.title}
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
