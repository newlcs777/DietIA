import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCog } from "lucide-react";
import { auth } from "../services/firebase";

import AvatarUpload from "../components/Profile/AvatarUpload";
import EditProfileForm from "../components/Profile/EditProfileForm";
import ChangePassword from "../components/Profile/ChangePassword";
import RecentActivity from "../components/Profile/RecentActivity";

export default function ConfiguracoesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center pt-16 pb-12 px-4 sm:px-6 lg:px-10 font-sans text-gray-800">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-2xl">
        {/* 🔹 Cabeçalho */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
            title="Voltar"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-[#F5BA45]" />
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 text-center">
            <UserCog className="text-[#F5BA45] w-7 h-7" />
            Configurações da Conta
          </h2>

          <div className="w-8" />
        </div>

        {/* 🔸 Resumo do Usuário */}
        <div className="flex flex-col items-center mb-10 text-center">
          <AvatarUpload />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4">
            {user?.displayName || "Usuário"}
          </h3>
          <p className="text-gray-500 text-sm break-all">{user?.email}</p>
        </div>

        {/* 🔸 Conteúdo em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 🟡 Coluna 1: Edição + Senha */}
          <div className="flex flex-col gap-10">
            <EditProfileForm />
            <ChangePassword />
          </div>

          {/* 🟢 Coluna 2: Informações + Atividade */}
          <div className="flex flex-col gap-10">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-inner hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Informações da Conta
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>Nome:</strong> {user?.displayName || "—"}
                </li>
                <li>
                  <strong>E-mail:</strong> {user?.email || "—"}
                </li>
                <li>
                  <strong>Status:</strong>{" "}
                  <span className="text-green-600 font-medium">Ativo</span>
                </li>
                <li>
                  <strong>Último acesso:</strong>{" "}
                  {user?.metadata?.lastSignInTime
                    ? new Date(
                        user.metadata.lastSignInTime
                      ).toLocaleString("pt-BR")
                    : "—"}
                </li>
              </ul>
            </div>

            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
