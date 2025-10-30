import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { Menu, X } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-black">
      {/* 🔹 Header (mobile) */}
      <header className="lg:hidden flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-yellow-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F5BA45] flex items-center justify-center text-white font-bold">
            {user?.displayName?.[0] || "U"}
          </div>
          <div>
            <h2 className="font-semibold text-black text-sm">
              {user?.displayName || "Usuário"}
            </h2>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Botão menu hambúrguer */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-md hover:bg-[#f9f9f9] transition"
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </button>
      </header>

      {/* 🔸 Sidebar */}
      <aside
        className={`${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static top-0 left-0 h-full w-72 bg-white shadow-md p-6 flex flex-col justify-between rounded-r-2xl transition-transform duration-300 z-50`}
      >
        <div>
          {/* Perfil */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#F5BA45] flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.[0] || "U"}
            </div>
            <h2 className="mt-3 font-semibold text-black text-lg">
              {user?.displayName || "Usuário"}
            </h2>
            <p className="text-sm text-gray-500 text-center break-all">
              {user?.email}
            </p>
          </div>

          {/* Menu de navegação */}
          <nav className="space-y-2">
            {[
              { path: "/dashboard/profile", label: "🏠 Dashboard" },
              { path: "/dashboard/avaliacao", label: "💪 Avaliação Física" },
              { path: "/dashboard/resultado", label: "📈 Resultado" },
              { path: "/dashboard/dieta", label: "🍽️ Dieta" },
              { path: "/dashboard/config", label: "⚙️ Configurações" },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg font-medium text-sm ${
                  location.pathname === path
                    ? "bg-yellow-100 text-black"
                    : "text-black hover:bg-yellow-50"
                } transition`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Botão de sair */}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white w-full py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
        >
          Sair
        </button>
      </aside>

      {/* 🔹 Conteúdo principal */}
      <main className="flex-1 overflow-y-auto bg-white px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8">
        <div className="w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Fundo escuro atrás do menu no mobile */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 lg:hidden z-40 transition-opacity"
        />
      )}
    </div>
  );
}
