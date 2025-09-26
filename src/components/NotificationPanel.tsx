import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X,
  Clock
} from "lucide-react";

interface Notification {
  id: string;
  type: "emergency" | "info" | "success" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClearAll: () => void;
}

export const NotificationPanel = ({ notifications: externalNotifications, onClearAll }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      type: "emergency",
      title: "New Critical Incident",
      message: "Structure fire reported at Main St & 5th Ave",
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: "notif-2", 
      type: "info",
      title: "Team Deployed",
      message: "Fire Team Alpha dispatched to incident INC-001",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      read: false
    },
    {
      id: "notif-3",
      type: "success",
      title: "Incident Resolved",
      message: "Traffic accident on Highway 101 cleared",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: true
    }
  ]);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random new notifications
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: Math.random() > 0.5 ? "info" : "warning",
          title: "System Update",
          message: "Database sync completed successfully",
          timestamp: new Date().toISOString(),
          read: false
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="h-4 w-4 text-emergency" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "emergency";
      case "warning":
        return "warning";
      case "success":
        return "success";
      case "info":
      default:
        return "info";
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return time.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setNotifications([]);
                onClearAll();
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              No notifications
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    border rounded-lg p-3 transition-all duration-200 hover:shadow-md
                    ${!notification.read ? 'bg-accent/50 border-l-4' : 'bg-background'}
                    ${!notification.read && notification.type === 'emergency' ? 'border-l-emergency animate-pulse-emergency' : ''}
                    ${!notification.read && notification.type === 'warning' ? 'border-l-warning' : ''}
                    ${!notification.read && notification.type === 'info' ? 'border-l-info' : ''}
                    ${!notification.read && notification.type === 'success' ? 'border-l-success' : ''}
                  `}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getNotificationIcon(notification.type)}
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};