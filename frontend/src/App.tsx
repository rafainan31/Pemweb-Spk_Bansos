import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import KriteriaPage from "./pages/KriteriaPage";
import LandingPage from "./pages/LandingPage";
import LaporanPage from "./pages/LaporanPage";
import Login from "./pages/Login";
import PenilaianPage from "./pages/PenilaianPage";
import PerhitunganPage from "./pages/PerhitunganPage";
import RankingPage from "./pages/RankingPage";
import WargaPage from "./pages/WargaPage";
import CekDataPage from "./pages/CekDataPage";
import PerbandinganPage from "./pages/PerbandinganPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isLogin = localStorage.getItem("bansos-auth") === "true";

  return isLogin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cek-data" element={<CekDataPage />} />

      {/* Admin Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/warga"
        element={
          <ProtectedRoute>
            <WargaPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kriteria"
        element={
          <ProtectedRoute>
            <KriteriaPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/penilaian"
        element={
          <ProtectedRoute>
            <PenilaianPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perhitungan"
        element={
          <ProtectedRoute>
            <PerhitunganPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ranking"
        element={
          <ProtectedRoute>
            <RankingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/laporan"
        element={
          <ProtectedRoute>
            <LaporanPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perbandingan"
        element={
          <ProtectedRoute>
            <PerbandinganPage/>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}