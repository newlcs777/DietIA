import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";

import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardLayout from "./layouts/DashboardLayout";

// 🔹 Novas páginas
import DashboardPage from "./pages/DashboardPage";
import DashboardProfile from "./pages/DashboardProfile";
import FoldsAssessment from "./components/Profile/FoldsAssessment";
import ResultPage from "./pages/ResultPage";
import DietaIAPage from "./pages/DietaIAPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🔓 Páginas públicas */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* 🔒 Páginas privadas (painel com menu lateral) */}
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/settings" element={<ProfileSettingsPage />} />

            {/* 🧠 Dashboard principal */}
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route path="avaliacao" element={<FoldsAssessment />} />
              <Route path="resultado" element={<ResultPage />} />
              <Route path="dieta" element={<DietaIAPage />} />

  
              
<Route path="config" element={<ConfiguracoesPage />} />
            </Route>

            
{/* ✅ dentro do dashboard (igual o TMB) */}
<Route path="/dashboard/avaliacao" element={<FoldsAssessment />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
