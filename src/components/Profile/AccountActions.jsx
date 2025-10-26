import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, signOut } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import ReauthDialog from "../Shared/ReauthDialog";

export default function AccountActions() {
  const navigate = useNavigate();
  const [needReauth, setNeedReauth] = useState(false);
  const [msg, setMsg] = useState("");
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const performDelete = async () => {
    try {
      // 🧹 Remove o documento do Firestore (opcional)
      await deleteDoc(doc(db, "users", user.uid)).catch(() => {});
      await deleteUser(user);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        setNeedReauth(true);
        setMsg("⚠️ Confirme sua identidade para excluir a conta.");
      } else {
        setMsg("❌ " + err.message);
      }
    }
  };

  return (
    <section className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-3xl shadow-md p-6 sm:p-8 w-full max-w-xl mx-auto mt-8 transition-all hover:shadow-lg">
      {/* 🔹 Título */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
        ⚙️ <span>Ações da Conta</span>
      </h2>

      {/* 🔸 Botões */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex-1 bg-[#F5BA45] text-gray-900 px-5 py-3 rounded-xl font-semibold hover:bg-[#e4a834] transition-all shadow-sm hover:shadow-md"
        >
          ⬅️ Voltar ao Dashboard
        </button>

        <button
          onClick={handleLogout}
          className="flex-1 bg-gray-700 text-white px-5 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
        >
          🚪 Sair
        </button>

        <button
          onClick={() => {
            if (
              confirm(
                "⚠️ Tem certeza que deseja excluir sua conta? Essa ação é permanente e não pode ser desfeita."
              )
            ) {
              performDelete();
            }
          }}
          className="flex-1 bg-red-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
        >
          ❌ Deletar Conta
        </button>
      </div>

      {/* 🔻 Mensagem de status */}
      {msg && (
        <p
          className={`text-sm mt-5 text-center font-medium ${
            msg.includes("sucesso")
              ? "text-green-600"
              : msg.includes("⚠️")
              ? "text-yellow-600"
              : "text-gray-600"
          }`}
        >
          {msg}
        </p>
      )}

      {/* 🔒 Diálogo de reautenticação */}
      <ReauthDialog
        open={needReauth}
        onClose={() => setNeedReauth(false)}
        onSuccess={performDelete}
      />
    </section>
  );
}
