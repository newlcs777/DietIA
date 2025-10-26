import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  appleProvider,
} from "../../services/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔁 Redireciona se já estiver logado
  useEffect(() => {
    if (user) navigate("/dashboard/profile");
  }, [user, navigate]);

  // 🔹 Login com email/senha
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard/profile");
    } catch {
      setError("Email ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login com Google/Apple
  const handleProviderLogin = async (provider, label) => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard/profile");
    } catch {
      setError(`Erro ao entrar com ${label}`);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] space-y-8 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
      {/* 🔹 Cabeçalho */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
          Bem-vindo ao{" "}
          <span className="text-[#F5BA45]">Consultor Inteligente</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Acesse sua conta e continue sua jornada fitness 💪
        </p>
      </header>

      {/* 🔻 Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 text-center shadow-sm">
          {error}
        </div>
      )}

      {/* 🔸 Formulário principal */}
      <form onSubmit={handleEmailLogin} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            E-mail
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5BA45] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Senha
          </label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5BA45] focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-gray-900 font-semibold transition-all ${
            loading
              ? "bg-[#F5BA45]/70 cursor-not-allowed"
              : "bg-[#F5BA45] hover:bg-[#e4a834] shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* 🟢 Login social */}
      <div className="pt-4 border-t border-gray-200 space-y-3">
        <p className="text-center text-gray-500 text-sm">
          ou entre com uma conta social
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleProviderLogin(googleProvider, "Google")}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-xl font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
          >
            <FcGoogle className="text-2xl" />
            <span>Entrar com Google</span>
          </button>

          <button
            onClick={() => handleProviderLogin(appleProvider, "Apple")}
            className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-xl font-medium shadow-sm hover:bg-gray-900 transition-all"
          >
            <FaApple className="text-2xl" />
            <span>Entrar com Apple</span>
          </button>
        </div>
      </div>

      {/* ⚙️ Rodapé */}
      <footer className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100 space-y-1">
        <p>
          Esqueceu sua senha?{" "}
          <span
            onClick={() => navigate("/forgot-password")}
            className="text-[#F5BA45] hover:underline cursor-pointer font-medium"
          >
            Recuperar
          </span>
        </p>
        <p>
          Não tem conta?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#F5BA45] hover:underline cursor-pointer font-medium"
          >
            Criar agora
          </span>
        </p>
      </footer>
    </div>
  );
}
