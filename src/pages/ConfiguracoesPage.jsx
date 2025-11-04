import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserCog } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserData } from "../store/userSlice";

import AvatarUpload from "../components/Profile/AvatarUpload";
import EditProfileForm from "../components/Profile/EditProfileForm";
import ChangePassword from "../components/Profile/ChangePassword";
import RecentActivity from "../components/Profile/RecentActivity";

// ✅ Função que converte email → "Nome Sobrenome"
function formatName(name, email) {
  const target = name?.includes("@") || !name ? email : name;

  if (!target) return "Usuário";

  const cleaned = target.split("@")[0].replace(/[0-9]/g, "");
  const partes = cleaned.split(/[._-]/g);
  const formatado = partes.slice(0, 2).join(" ");

  return formatado.replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function ConfiguracoesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const nomeFormatado = formatName(userData?.displayName, userData?.email);

  return (
    <div className="min-h-screen flex flex-col items-center w-full font-sans text-gray-800 px-4 sm:px-6 lg:px-10 pt-20 pb-14">

      <div className="w-full max-w-5xl">

        {/* 🔹 Cabeçalho */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/dashboard/profile")}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
            title="Voltar"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-[#F5BA45] transition-colors" />
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-gray-900 text-center">
            <UserCog className="text-[#F5BA45] w-7 h-7" />
            Configurações da Conta
          </h2>

          <div className="w-8" /> {/* alinhamento visual */}
        </div>

        {/* 🔸 Loading */}
        {loading ? (
          <div className="text-center text-gray-500 py-10 animate-pulse">
            Carregando dados...
          </div>
        ) : (
          <>
            {/* 🔹 Avatar + Nome */}
            <div className="flex flex-col items-center mb-10 text-center">
              <AvatarUpload userData={userData} />

              <h3 className="text-xl font-semibold text-gray-900 mt-4">
                {nomeFormatado}
              </h3>

              <p className="text-gray-500 text-sm break-all">
                {userData?.email || "—"}
              </p>
            </div>

            {/* 🔸 GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* 🟡 Coluna esquerda */}
              <div className="flex flex-col gap-10">
                <EditProfileForm userData={userData} />
                <ChangePassword />
              </div>

              {/* 🟢 Coluna direita */}
              <div className="flex flex-col gap-10">

                {/* ✅ Informações da Conta */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Informações da Conta
                  </h3>

                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>
                      <strong>Nome:</strong> {nomeFormatado}
                    </li>
                    <li><strong>E-mail:</strong> {userData?.email || "—"}</li>
                    <li>
                      <strong>Status:</strong>{" "}
                      <span className="text-green-600 font-medium">Ativo</span>
                    </li>
                    <li>
                      <strong>Último acesso:</strong>{" "}
                      {userData?.lastLogin
                        ? new Date(userData.lastLogin).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </li>
                  </ul>
                </div>

                {/* Histórico */}
                <RecentActivity userData={userData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
