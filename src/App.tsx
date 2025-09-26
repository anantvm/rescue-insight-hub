import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { io } from "socket.io-client";

const queryClient = new QueryClient();

// Connect to backend (adjust URL if needed)
const socket = io("http://localhost:4000");

const App = () => {
  const [updates, setUpdates] = useState<string[]>([]);

  useEffect(() => {
    // Ask notification permission once
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Listen for DB updates
    socket.on("db_update", (data: string) => {
      console.log("📩 New DB row:", data);
      setUpdates((prev) => [...prev, data]);

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification("🚨 New DB Row", {
          body: data,
        });
      }
    });

    return () => {
      socket.off("db_update");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index updates={updates} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
