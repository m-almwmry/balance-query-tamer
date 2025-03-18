
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Create QueryClient
const queryClient = new QueryClient();

// Add framer-motion package
import { MotionConfig } from "framer-motion";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div dir="rtl" className="font-cairo">
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
            
            :root {
              --font-cairo: 'Cairo', sans-serif;
            }
            
            body {
              font-family: var(--font-cairo);
            }
          `
        }} />
        <Toaster />
        <Sonner />
        <MotionConfig 
          reducedMotion="user"
          transition={{
            type: "spring",
            bounce: 0.15
          }}
        >
          <AuthProvider>
            <BrowserRouter>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </BrowserRouter>
          </AuthProvider>
        </MotionConfig>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
