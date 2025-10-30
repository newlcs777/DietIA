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
    <div className="min-h-screen flex flex-col font-sans text-black bg-white">
      {/* 🔹 Cabeçalho fixo e limpo */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-[100]">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-5 sm:px-8 py-4">
          <h1
            onClick={() => navigate("/dashboard/profile")}
            className="text-lg sm:text-xl font-bold text-[#F5BA45] cursor-pointer select-none"
          >
            Consultor Inteligente
          </h1>

          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-9 h-9 rounded-full bg-[#F5BA45] text-white flex items-center justify-center font-bold">
                {user.displayName?.[0] || "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {user.displayName || "Usuário"}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Sair
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* 🔸 Conteúdo principal */}
      <main className="flex-1 w-full flex justify-center items-start px-5 sm:px-8 pt-28 pb-14 relative z-0 bg-white">
        <div className="w-full max-w-7xl mx-auto bg-white">
          <Outlet />
        </div>
      </main>

      {/* 🔻 Rodapé limpo */}
      <footer className="text-center text-xs text-black py-6 bg-white">
        © {new Date().getFullYear()} Consultor Inteligente · Todos os direitos reservados
      </footer>
    </div>
  );
}
