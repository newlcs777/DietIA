import { useState } from "react";
import { auth } from "../../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ E-mail de recuperação enviado com sucesso!");
      setEmail("");
    } catch (err) {
      setError("❌ " + (err.code === "auth/user-not-found"
        ? "Usuário não encontrado. Verifique o e-mail digitado."
        : err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="w-full max-w-md mx-auto bg-white border border-gray-100 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-4 transition-all duration-300 hover:shadow-xl"
    >
      {/* 🔹 Título e descrição */}
      <div className="text-center mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Recuperar Senha
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Digite o e-mail cadastrado para receber o link de redefinição.
        </p>
      </div>

      {/* 🔸 Campo de e-mail */}
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5BA45] outline-none text-sm sm:text-base transition w-full"
      />

      {/* 🔸 Botão */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition-all shadow-md ${
          loading
            ? "bg-[#F5BA45]/60 cursor-not-allowed"
            : "bg-[#F5BA45] hover:bg-[#e2a93f]"
        }`}
      >
        {loading ? "Enviando..." : "Recuperar Senha"}
      </button>

      {/* 🔹 Mensagens */}
      {message && (
        <p className="text-green-600 text-sm text-center mt-2 font-medium">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-600 text-sm text-center mt-2 font-medium">
          {error}
        </p>
      )}
    </form>
  );
}
