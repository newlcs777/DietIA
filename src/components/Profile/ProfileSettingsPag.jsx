import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import ChangePassword from "../components/Profile/ChangePassword";
import RecentActivity from "../components/Profile/RecentActivity";
import AccountActions from "../components/Profile/AccountActions";
import AvatarUpload from "../components/Profile/AvatarUpload";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4 sm:p-6"
    >
      {/* 📦 Container principal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto 
                   p-8 sm:p-10 border border-gray-100 transition-all duration-300 
                   hover:shadow-[0_10px_35px_rgba(0,0,0,0.1)]"
      >
        {/* 🔹 Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#F5BA45]" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Configurações da Conta
            </h2>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* 🔸 Resumo do usuário */}
        <div className="flex flex-col items-center mb-10 space-y-3">
          <AvatarUpload />
          <h3 className="text-lg font-semibold text-gray-800">
            {userData?.name || "Usuário"}
          </h3>
          <p className="text-gray-500 text-sm">{userData?.email || "E-mail não disponível"}</p>
        </div>

        {/* 🔹 Conteúdo organizado */}
        <div className="space-y-10">
          <ChangePassword />
          <RecentActivity />
          <AccountActions />
        </div>
      </motion.div>
    </motion.div>
  );
}
