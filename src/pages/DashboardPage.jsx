import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { Menu, X } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔹 Monitora autenticação
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  // 🔸 Logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  // 🔸 Links da sidebar
  const navLinks = [
    { path: "/dashboard/profile", label: "🏠 Dashboard" },
    { path: "/dashboard/avaliacao", label: "💪 Avaliação Física" },
    { path: "/dashboard/resultado", label: "📈 Resultado" },
    { path: "/dashboard/dieta", label: "🍽️ Dieta" },
    { path: "/dashboard/config", label: "⚙️ Configurações" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans text-black">
      {/* 🔹 Header (mobile) */}
      <header className="lg:hidden flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-yellow-100 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F5BA45] flex items-center justify-center text-white font-bold uppercase">
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
          className="p-2 rounded-md hover:bg-yellow-50 transition"
          aria-label="Abrir menu"
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
        } lg:translate-x-0 fixed lg:static top-0 left-0 h-full w-72 bg-white shadow-md p-6 flex flex-col justify-between rounded-r-2xl transition-transform duration-300 ease-in-out z-50`}
      >
        <div>
          {/* Perfil */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#F5BA45] flex items-center justify-center text-white text-2xl font-bold uppercase shadow-sm">
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
            {navLinks.map(({ path, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    active
                      ? "bg-[#F5BA45]/20 text-black border-l-4 border-[#F5BA45]"
                      : "text-gray-700 hover:bg-yellow-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Botão de sair */}
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 text-white w-full py-2 rounded-lg hover:bg-red-600 active:scale-95 transition font-medium text-sm shadow-sm"
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

      {/* 🔸 Fundo escuro no mobile (overlay) */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 lg:hidden z-40 transition-opacity"
        />
      )}
    </div>
  );
}
