import { Outlet, useNavigate } from "react-router-dom";
import { auth, signOut, onAuthStateChanged } from "../services/firebase";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔹 Observa o estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // 🔸 Logout seguro
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
      {/* 🔹 Cabeçalho fixo */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-[100]">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-5 sm:px-8 py-4">
          <h1
            onClick={() => navigate("/dashboard/profile")}
            className="text-lg sm:text-xl font-bold text-[#F5BA45] cursor-pointer select-none hover:text-[#e2a93f] transition-colors"
          >
            Consultor Inteligente
          </h1>

          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-9 h-9 rounded-full bg-[#F5BA45] text-white flex items-center justify-center font-bold">
                {user.displayName?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium truncate max-w-[120px]">
                {user.displayName || "Usuário"}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-all active:scale-95"
              >
                Sair
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* 🔸 Conteúdo principal */}
      <main className="flex-1 w-full flex justify-center items-start px-5 sm:px-8 pt-28 pb-14 bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* 🔻 Rodapé */}
      <footer className="text-center text-xs text-gray-600 py-6 bg-white border-t border-gray-100">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#F5BA45] font-semibold">
          Consultor Inteligente
        </span>{" "}
        · Todos os direitos reservados
      </footer>
    </div>
  );
}
