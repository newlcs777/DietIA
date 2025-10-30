import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const navLinks = [
    { path: "/dashboard", label: "🏠 Dashboard" },
    { path: "/avaliacao", label: "💪 Avaliação Física" },
    { path: "/consultor", label: "🤖 Consultor IA" },
    { path: "/resultado", label: "📈 Resultado" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gradient-to-b from-[#fffdf5] via-[#fffbea] to-[#fff7d9]">
      {/* 🔹 Navbar superior */}
      <header className="bg-white/90 backdrop-blur-md border-b border-yellow-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4">
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-lg sm:text-xl font-bold text-[#F5BA45] cursor-pointer select-none"
          >
            Consultor Inteligente
          </h1>

          {/* Links desktop */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`transition ${
                  location.pathname === path
                    ? "text-[#F5BA45] border-b-2 border-[#F5BA45]"
                    : "text-gray-600 hover:text-[#F5BA45]"
                } pb-1`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Perfil e logout */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F5BA45] flex items-center justify-center text-white font-bold text-sm">
                  {user.displayName?.[0] || "U"}
                </div>
                <p className="hidden sm:block text-sm text-gray-700">
                  {user.displayName || "Usuário"}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-yellow-100 transition"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* 🔸 Conteúdo principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
