import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithPopup,
  unlink,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Facebook, Mail } from "lucide-react";

const providersMap = {
  google: {
    id: "google.com",
    instance: new GoogleAuthProvider(),
    label: "Google",
    icon: <Mail className="w-4 h-4 text-[#EA4335]" />,
  },
  facebook: {
    id: "facebook.com",
    instance: new FacebookAuthProvider(),
    label: "Facebook",
    icon: <Facebook className="w-4 h-4 text-[#1877F2]" />,
  },
};

export default function SocialConnections() {
  const { userData } = useSelector((state) => state.user);
  const [linked, setLinked] = useState({ google: false, facebook: false });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Atualiza status de provedores conectados
  const refreshStatus = () => {
    const user = auth.currentUser;
    const providerIds = user?.providerData?.map((p) => p.providerId) || [];
    setLinked({
      google: providerIds.includes(providersMap.google.id),
      facebook: providerIds.includes(providersMap.facebook.id),
    });
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  // 🔸 Conectar conta
  const handleLink = async (name) => {
    setMsg("");
    setLoading(true);
    try {
      await linkWithPopup(auth.currentUser, providersMap[name].instance);
      setMsg(`✅ ${providersMap[name].label} conectado com sucesso.`);
      refreshStatus();
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔸 Desconectar conta
  const handleUnlink = async (name) => {
    setMsg("");
    setLoading(true);
    try {
      await unlink(auth.currentUser, providersMap[name].id);
      setMsg(`✅ ${providersMap[name].label} desconectado.`);
      refreshStatus();
    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Linha de provedor
  const RenderRow = ({ name }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 
                 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        {providersMap[name].icon}
        <span>{providersMap[name].label}</span>
      </div>

      {linked[name] ? (
        <button
          onClick={() => handleUnlink(name)}
          disabled={loading}
          className="text-sm font-semibold text-gray-700 bg-gray-200 px-4 py-1.5 rounded-lg 
                     hover:bg-gray-300 active:scale-95 transition-all"
        >
          Desconectar
        </button>
      ) : (
        <button
          onClick={() => handleLink(name)}
          disabled={loading}
          className="text-sm font-semibold bg-emerald-600 text-white px-4 py-1.5 rounded-lg 
                     hover:bg-emerald-700 active:scale-95 transition-all"
        >
          Conectar
        </button>
      )}
    </motion.div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-3xl shadow-sm 
                 hover:shadow-md transition-all duration-300 p-6 sm:p-8"
    >
      {/* 🔹 Título */}
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        🔗 Conectar Redes Sociais
      </h2>

      {/* 🔸 Lista */}
      <div className="grid gap-3">
        <RenderRow name="google" />
        <RenderRow name="facebook" />
      </div>

      {/* 🔻 Mensagem de status */}
      {msg && (
        <p
          className={`mt-4 text-sm text-center font-medium ${
            msg.includes("✅")
              ? "text-green-600"
              : msg.includes("❌")
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {msg}
        </p>
      )}

      {/* 🔹 Observação */}
      <p className="text-xs text-gray-400 mt-3 leading-snug text-center sm:text-left">
        💡 Dica: mantenha pelo menos um provedor conectado para evitar bloqueios de acesso.
      </p>
    </motion.section>
  );
}
