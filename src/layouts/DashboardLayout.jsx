import { Outlet, useNavigate } from "react-router-dom";
import { auth, signOut, onAuthStateChanged } from "../services/firebase";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Observa login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-black bg-white">

      {/* ✅ Cabeçalho fixo */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-[100]">
        <nav className="max-w-[1400px] mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
          <h1
            onClick={() => navigate("/dashboard/profile")}
            className="text-lg sm:text-xl font-bold text-[#F5BA45] cursor-pointer hover:text-[#e2a93f] transition"
          >
            Consultor Inteligente
          </h1>

          {user && (
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#F5BA45] text-white flex items-center justify-center font-bold">
                {user.displayName?.[0]?.toUpperCase() ?? "U"}
              </div>

              {/* Nome (oculta no celular) */}
              <span className="hidden sm:block text-sm font-medium truncate max-w-[140px] capitalize">
                {user.displayName || "Usuário"}
              </span>

              {/* Botão sair */}
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition active:scale-95"
              >
                Sair
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* ✅ Conteúdo principal agora ocupa a largura total no mobile e centraliza no desktop */}
      <main className="flex-1 w-full flex justify-center sm:px-0 pt-28 pb-14">
        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 md:px-10">
          <Outlet />
        </div>
      </main>

      {/* Rodapé */}
      <footer className="text-center text-xs text-gray-600 py-6 bg-white border-t border-gray-100">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#F5BA45] font-semibold">Consultor Inteligente</span>
        {" "}· Todos os direitos reservados
      </footer>
    </div>
  );
}
