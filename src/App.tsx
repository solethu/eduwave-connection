
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Page imports with lazy loading for better performance
const Login = lazy(() => import("./pages/Login"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const VideoPage = lazy(() => import("./pages/VideoPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create a loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Student Routes */}
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/videos/:id" element={<VideoPage />} />
            <Route path="/videos" element={<ResourcesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/videos" element={<ResourcesPage />} />
            <Route path="/admin/resources" element={<ResourcesPage />} />
            
            {/* Redirect from homepage to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
