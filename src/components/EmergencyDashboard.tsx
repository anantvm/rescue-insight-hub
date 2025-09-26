import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  Phone,
  CheckCircle,
  Zap,
  Activity
} from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";
import { IncidentCard } from "./IncidentCard";

interface Incident {
  id: string;
  type: string;
  priority: "critical" | "high" | "medium" | "low";
  location: string;
  description: string;
  reportedAt: string;
  status: "active" | "responding" | "resolved";
  assignedTeam?: string;
}

const EmergencyDashboard = () => {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "INC-001",
      type: "Structure Fire",
      priority: "critical",
      location: "Downtown District, Main St & 5th Ave",
      description: "Multi-story building fire with potential occupants trapped",
      reportedAt: "2024-01-15T10:30:00Z",
      status: "responding",
      assignedTeam: "Fire Team Alpha"
    },
    {
      id: "INC-002", 
      type: "Medical Emergency",
      priority: "high",
      location: "Residential Area, Oak Park Drive",
      description: "Cardiac arrest, CPR in progress",
      reportedAt: "2024-01-15T10:25:00Z",
      status: "active",
      assignedTeam: "Paramedic Unit 3"
    },
    {
      id: "INC-003",
      type: "Traffic Accident",
      priority: "medium",
      location: "Highway 101, Mile Marker 23",
      description: "Multi-vehicle collision, minor injuries reported",
      reportedAt: "2024-01-15T10:15:00Z",
      status: "resolved"
    }
  ]);

  const [notifications, setNotifications] = useState<any[]>([]);

  const activeIncidents = incidents.filter(i => i.status !== "resolved");
  const criticalIncidents = incidents.filter(i => i.priority === "critical");

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "emergency";
      case "high": return "warning";
      case "medium": return "info";
      case "low": return "success";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-primary">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              Emergency Command Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time incident monitoring and response coordination
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              <Activity className="h-4 w-4 mr-2" />
              System Active
            </Badge>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Last Update</div>
              <div className="font-semibold">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIncidents.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalIncidents.length} critical priority
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Teams</CardTitle>
            <Users className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              8 deployed, 4 available
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2m</div>
            <p className="text-xs text-muted-foreground">
              -12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-elevated">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +8% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Incidents */}
        <div className="lg:col-span-2">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Active Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeIncidents.map((incident) => (
                <IncidentCard 
                  key={incident.id} 
                  incident={incident}
                  formatTime={formatTime}
                  getPriorityColor={getPriorityColor}
                />
              ))}
              {activeIncidents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                  All incidents resolved
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications & Quick Actions */}
        <div className="space-y-6">
          <NotificationPanel 
            notifications={notifications}
            onClearAll={() => setNotifications([])}
          />
          
          {/* Quick Actions */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Dispatch
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                View Map
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Team Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;