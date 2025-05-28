import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, List, Eye, LogOut, FileText, Inbox } from "lucide-react";

interface DashboardProps {
  user: any;
  onShowComplaintForm: () => void;
  onShowMyComplaints: () => void;
  onShowVeedores: () => void;
  onLogout: () => void;
  recentComplaints?: any[];
}

export function Dashboard({ 
  user, 
  onShowComplaintForm, 
  onShowMyComplaints, 
  onShowVeedores, 
  onLogout,
  recentComplaints = []
}: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Bienvenido, {user?.nombre} {user?.apellido}
            </h2>
            <p className="opacity-90">Gestiona tus quejas de salud desde tu panel personal</p>
          </div>
          <Button 
            onClick={onLogout}
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card 
          className="border-t-4 border-green-600 cursor-pointer hover:shadow-xl transition-shadow" 
          onClick={onShowComplaintForm}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Nueva Queja</h3>
                <p className="text-sm text-muted-foreground">Presenta una nueva queja de salud</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-t-4 border-primary cursor-pointer hover:shadow-xl transition-shadow"
          onClick={onShowMyComplaints}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <List className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Mis Quejas</h3>
                <p className="text-sm text-muted-foreground">Consulta tus quejas registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-t-4 border-orange-500 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={onShowVeedores}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ver Veedores</h3>
                <p className="text-sm text-muted-foreground">Lista de veedores activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {recentComplaints.length > 0 ? (
              recentComplaints.slice(0, 3).map((complaint, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{complaint.problema}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {complaint.estado || 'En proceso'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Inbox className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No tienes quejas registradas aún</p>
                <Button 
                  onClick={onShowComplaintForm}
                  variant="link" 
                  className="mt-4 text-primary hover:text-primary/80"
                >
                  Presenta tu primera queja →
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
