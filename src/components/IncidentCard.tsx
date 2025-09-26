import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  Users, 
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Eye
} from "lucide-react";

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

interface IncidentCardProps {
  incident: Incident;
  formatTime: (timestamp: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const IncidentCard = ({ incident, formatTime, getPriorityColor }: IncidentCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "responding":
        return <Eye className="h-4 w-4 text-info" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "warning";
      case "responding":
        return "info";
      case "resolved":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <div className={`
      border rounded-lg p-4 transition-all duration-200 hover:shadow-md
      ${incident.priority === 'critical' ? 'bg-emergency/5 border-l-4 border-l-emergency' : 'bg-card'}
      ${incident.priority === 'high' ? 'border-l-4 border-l-warning' : ''}
    `}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{incident.type}</h3>
            <Badge variant="outline" className={`text-${getPriorityColor(incident.priority)}`}>
              {incident.priority.toUpperCase()}
            </Badge>
            <Badge variant="outline" className={`text-${getStatusColor(incident.status)}`}>
              {getStatusIcon(incident.status)}
              {incident.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            ID: {incident.id}
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-foreground mb-3 leading-relaxed">
        {incident.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {incident.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Reported at {formatTime(incident.reportedAt)}
        </div>
        {incident.assignedTeam && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Assigned to {incident.assignedTeam}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          View Details
        </Button>
        {incident.status === "active" && (
          <Button size="sm" variant="default">
            Assign Team
          </Button>
        )}
        {incident.status === "responding" && (
          <Button size="sm" variant="success">
            Mark Resolved
          </Button>
        )}
      </div>
    </div>
  );
};