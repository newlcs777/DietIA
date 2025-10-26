import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ChangePassword from "../components/Profile/ChangePassword";
import AccountActions from "../components/Profile/AccountActions";
import RecentActivity from "../components/Profile/RecentActivity";

export default function ProfileSettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 font-sans text-gray-800 p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full max-w-2xl transition-all hover:shadow-2xl">
        {/* 🔹 Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            ⚙️ Configurações da Conta
          </h2>

          {/* espaço para balancear layout */}
          <div className="w-8" />
        </div>

        {/* 🔸 Seções principais */}
        <div className="space-y-6">
          <section className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-inner">
            <ChangePassword />
          </section>

          <section className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-inner">
            <AccountActions />
          </section>

          <section className="bg-gray-50 rounded-2xl p-5 border border-gray-100 shadow-inner">
            <RecentActivity />
          </section>
        </div>
      </div>
    </div>
  );
}
