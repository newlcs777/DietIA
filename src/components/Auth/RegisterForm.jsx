import { useState } from "react";
import { auth, db } from "../../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Cadastro
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        createdAt: new Date(),
      });

      setSuccess("✅ Conta criada com sucesso! Faça login para continuar.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("❌ Erro ao registrar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="w-full max-w-sm bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.08)] space-y-6 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
    >
      {/* 🔹 Cabeçalho */}
      <header className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Crie sua conta
        </h2>
        <p className="text-sm text-gray-600">
          Leve seu treino e sua alimentação a outro nível 💪
        </p>
      </header>

      {/* 🔻 Mensagens de erro e sucesso */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 text-center shadow-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-3 text-center shadow-sm">
          {success}
        </div>
      )}

      {/* 🔸 Campos de formulário */}
      <div className="space-y-4">
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
            placeholder="Crie uma senha segura"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5BA45] focus:border-transparent transition"
          />
        </div>
      </div>

      {/* 🟡 Botão */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl text-gray-900 font-semibold transition-all ${
          loading
            ? "bg-[#F5BA45]/70 cursor-not-allowed"
            : "bg-[#F5BA45] hover:bg-[#e4a834] shadow-md hover:shadow-lg"
        }`}
      >
        {loading ? "Criando conta..." : "Registrar"}
      </button>

      {/* ⚙️ Rodapé */}
      <footer className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
        Já tem uma conta?{" "}
        <span
          onClick={() => (window.location.href = "/")}
          className="text-[#F5BA45] hover:underline cursor-pointer font-medium"
        >
          Fazer login
        </span>
      </footer>
    </form>
  );
}
