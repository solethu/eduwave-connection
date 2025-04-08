
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";

// Page imports with lazy loading for better performance
const Login = lazy(() => import("./pages/Login"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const VideoPage = lazy(() => import("./pages/VideoPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const ManageStudents = lazy(() => import("./pages/ManageStudents"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create a loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  
  // Check for user data in localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Create a wrapper component that checks authentication
  const ProtectedRoute = ({ children, requiredRole = null }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }
    
    return children;
  };

  return (
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
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/videos/:id" element={
                <ProtectedRoute>
                  <VideoPage />
                </ProtectedRoute>
              } />
              <Route path="/videos" element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/students" element={
                <ProtectedRoute requiredRole="admin">
                  <ManageStudents />
                </ProtectedRoute>
              } />
              <Route path="/admin/videos" element={
                <ProtectedRoute requiredRole="admin">
                  <ResourcesPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/resources" element={
                <ProtectedRoute requiredRole="admin">
                  <ResourcesPage />
                </ProtectedRoute>
              } />
              
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
};

export default App;
