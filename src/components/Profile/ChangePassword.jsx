import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import ReauthDialog from "../Shared/ReauthDialog";
import { motion } from "framer-motion";

export default function ChangePassword() {
  const [form, setForm] = useState({ newPass: "", confirm: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [needReauth, setNeedReauth] = useState(false);

  const user = auth.currentUser;

  // 🔹 Registra no Firestore que houve troca de senha
  const writeAudit = async () => {
    if (!user) return;
    const auditRef = collection(doc(db, "users", user.uid), "audit");
    await addDoc(auditRef, {
      type: "password_change",
      at: serverTimestamp(),
    });
  };

  // 🔸 Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (form.newPass.length < 6) {
      setMsg("⚠️ A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (form.newPass !== form.confirm) {
      setMsg("❌ As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user, form.newPass);
      await writeAudit();
      setMsg("✅ Senha alterada com sucesso!");
      setForm({ newPass: "", confirm: "" });
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        setNeedReauth(true);
        setMsg("🔐 É preciso confirmar sua identidade para continuar.");
      } else {
        setMsg("❌ " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Reexecuta após reautenticação
  const afterReauth = async () => {
    try {
      setLoading(true);
      await updatePassword(user, form.newPass);
      await writeAudit();
      setMsg("✅ Senha alterada com sucesso!");
      setForm({ newPass: "", confirm: "" });
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8 transition-all hover:shadow-md"
    >
      {/* 🔹 Título */}
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        🔑 Alterar Senha
      </h2>

      {/* 🔸 Formulário */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2 text-sm"
      >
        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-medium">Nova senha</label>
          <input
            type="password"
            placeholder="Digite a nova senha"
            value={form.newPass}
            onChange={(e) =>
              setForm((f) => ({ ...f, newPass: e.target.value }))
            }
            required
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5BA45] transition"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-600 font-medium">
            Confirmar nova senha
          </label>
          <input
            type="password"
            placeholder="Confirme sua nova senha"
            value={form.confirm}
            onChange={(e) =>
              setForm((f) => ({ ...f, confirm: e.target.value }))
            }
            required
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5BA45] transition"
          />
        </div>

        {/* 🟡 Botão */}
        <div className="sm:col-span-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F5BA45] hover:bg-[#e4a834] hover:shadow-md active:scale-95"
            }`}
          >
            {loading ? "Atualizando..." : "Atualizar Senha"}
          </button>
        </div>
      </form>

      {/* 🔻 Mensagem de feedback */}
      {msg && (
        <p
          className={`mt-4 text-center text-sm font-medium ${
            msg.includes("sucesso")
              ? "text-green-600"
              : msg.includes("⚠️")
              ? "text-yellow-600"
              : msg.includes("❌")
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {msg}
        </p>
      )}

      {/* 🔒 Modal de reautenticação */}
      <ReauthDialog
        open={needReauth}
        onClose={() => setNeedReauth(false)}
        onSuccess={afterReauth}
      />
    </motion.section>
  );
}
