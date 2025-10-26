import ChangePassword from "./ChangePassword";
import SocialConnections from "./SocialConnections";
import RecentActivity from "./RecentActivity";
import AccountActions from "./AccountActions";

export default function AccountSettings() {
  return (
    <div className="bg-white/95 backdrop-blur-md shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-3xl p-6 sm:p-8 w-full max-w-3xl mx-auto space-y-8 border border-gray-100 transition-all hover:shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
      {/* 🔹 Título */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          ⚙️ <span>Configurações da Conta</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Gerencie sua senha, conexões e informações de segurança.
        </p>
      </header>

      {/* 🔸 Seções */}
      <section className="space-y-6 sm:space-y-8">
        <ChangePassword />
        <SocialConnections />
        <RecentActivity />
        <AccountActions />
      </section>

      {/* ⚙️ Rodapé opcional */}
      <footer className="text-center text-sm text-gray-400 pt-4 border-t border-gray-100">
        <p>Consultor Inteligente © {new Date().getFullYear()} — Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
