import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fffdfa] via-[#fdfcf7] to-[#f6f5f0] font-sans text-gray-800">
      {/* 🔹 Navbar superior */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-[9999]">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1
            onClick={() => navigate("/dashboard/profile")}
            className="text-lg sm:text-xl font-bold text-[#F5BA45] cursor-pointer select-none"
          >
            
            Consultor Inteligente
          </h1>

          {user && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F5BA45] text-white flex items-center justify-center font-bold">
                {user.displayName?.[0] || "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user.displayName || "Usuário"}
              </span>
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Sair
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* 🔸 Conteúdo principal (apenas Outlet, sem duplicar o card lateral) */}
      <main className="flex-1 flex justify-center items-start p-4 sm:p-8 lg:p-10 mt-8">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-[#F5BA45]/20">
          <Outlet />
        </div>
      </main>

      {/* 🔻 Rodapé */}
      <footer className="text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Consultor Inteligente · Todos os direitos reservados
      </footer>
    </div>
  );
}
