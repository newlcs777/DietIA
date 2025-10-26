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
      setError("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleReset}
      className="w-full max-w-md mx-auto bg-white border border-gray-100 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-4 transition-all hover:shadow-lg"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
        Recuperar Senha
      </h2>
      <p className="text-gray-500 text-sm text-center mb-4">
        Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
      </p>

      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base transition"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-medium text-white text-sm sm:text-base transition ${
          loading
            ? "bg-yellow-400 cursor-not-allowed opacity-80"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
      >
        {loading ? "Enviando..." : "Recuperar senha"}
      </button>

      {message && (
        <p className="text-green-600 text-sm text-center mt-2">{message}</p>
      )}
      {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
    </form>
  );
}
