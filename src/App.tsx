import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Sejarah from "./pages/Sejarah";
import VisiMisi from "./pages/VisiMisi";
import RoadMap from "./pages/RoadMap";
import Tim from "./pages/Tim";
import Login from "./pages/Login";
import Dokumen from "./pages/Dokumen";
import Admin from "./pages/Admin";
import AdminDokumen from "./pages/AdminDokumen";
import AdminAkun from "./pages/AdminAkun";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/sejarah" element={<Sejarah />} />
              <Route path="/visi-misi" element={<VisiMisi />} />
              <Route path="/road-map" element={<RoadMap />} />
              <Route path="/tim" element={<Tim />} />
            </Route>

            {/* Standalone (no shared Layout) */}
            <Route path="/login" element={<Login />} />

            {/* Protected: user only */}
            <Route
              path="/dokumen"
              element={
                <ProtectedRoute allowedRole="user">
                  <Dokumen />
                </ProtectedRoute>
              }
            />

            {/* Protected: admin only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dokumen"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDokumen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/akun"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminAkun />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
