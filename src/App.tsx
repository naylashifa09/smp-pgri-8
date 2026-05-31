import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PPDB from "./pages/PPDB.tsx";
import NotFound from "./pages/NotFound.tsx";
import BeritaDetail from "./pages/BeritaDetail.tsx";
import Login from "./pages/admin/Login.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import AdminBerita from "./pages/admin/AdminBerita.tsx";
import AdminFasilitas from "./pages/admin/AdminFasilitas.tsx";
import AdminGaleri from "./pages/admin/AdminGaleri.tsx";
import AdminGuruStaff from "./pages/admin/AdminGuruStaff.tsx";
import AdminConfig from "./pages/admin/AdminConfig.tsx";
import AdminPPDB from "./pages/admin/AdminPPDB.tsx";
import { ProtectedRoute } from "./components/admin/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/ppdb" element={<PPDB />} />

          <Route path="/berita/:slug" element={<BeritaDetail />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/berita" element={<ProtectedRoute><AdminBerita /></ProtectedRoute>} />
          <Route path="/admin/fasilitas" element={<ProtectedRoute><AdminFasilitas /></ProtectedRoute>} />
          <Route path="/admin/galeri" element={<ProtectedRoute><AdminGaleri /></ProtectedRoute>} />
          <Route path="/admin/guru-staff" element={<ProtectedRoute><AdminGuruStaff /></ProtectedRoute>} />
          <Route path="/admin/ppdb" element={<ProtectedRoute><AdminPPDB /></ProtectedRoute>} />
          <Route path="/admin/config" element={<ProtectedRoute><AdminConfig /></ProtectedRoute>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
