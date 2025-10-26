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
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      {/* 🔹 Navbar superior */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-10 py-4">
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-lg sm:text-xl font-bold text-[#F5BA45] cursor-pointer"
          >
            Consultor Inteligente
          </h1>

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

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm">
                  {user.displayName?.[0] || "U"}
                </div>
                <p className="hidden sm:block text-sm text-gray-700">
                  {user.displayName || "Usuário"}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 🔸 Conteúdo principal */}
      <main className="flex flex-1 flex-col md:flex-row justify-center md:justify-between items-start p-6 sm:p-10 gap-8">
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
