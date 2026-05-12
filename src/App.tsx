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
import Berita from "./pages/Berita";
import BeritaDetail from "./pages/BeritaDetail";
import Dokumen from "./pages/Dokumen";
import Admin from "./pages/Admin";
import AdminDokumen from "./pages/AdminDokumen";
import AdminBerita from "./pages/AdminBerita";
import AdminAkun from "./pages/AdminAkun";
import AdminBeranda from "./pages/AdminBeranda";
import AdminSejarah from "./pages/AdminSejarah";
import AdminVisiMisi from "./pages/AdminVisiMisi";
import AdminRoadMap from "./pages/AdminRoadMap";
import AdminTim from "./pages/AdminTim";
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
              <Route path="/berita" element={<Berita />} />
              <Route path="/berita/:id" element={<BeritaDetail />} />
              <Route
                path="/dokumen"
                element={
                  <ProtectedRoute allowedRole="user">
                    <Dokumen />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="/login" element={<Login />} />
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
              path="/admin/berita"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminBerita />
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
            <Route path="/admin/beranda" element={<ProtectedRoute allowedRole="admin"><AdminBeranda /></ProtectedRoute>} />
            <Route path="/admin/sejarah" element={<ProtectedRoute allowedRole="admin"><AdminSejarah /></ProtectedRoute>} />
            <Route path="/admin/visi-misi" element={<ProtectedRoute allowedRole="admin"><AdminVisiMisi /></ProtectedRoute>} />
            <Route path="/admin/road-map" element={<ProtectedRoute allowedRole="admin"><AdminRoadMap /></ProtectedRoute>} />
            <Route path="/admin/tim" element={<ProtectedRoute allowedRole="admin"><AdminTim /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
