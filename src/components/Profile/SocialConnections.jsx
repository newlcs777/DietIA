///conectar/desconectar Google/Facebook

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithPopup,
  unlink,
} from "firebase/auth";
import { auth } from "../../services/firebase";

const providersMap = {
  google: { id: "google.com", instance: new GoogleAuthProvider(), label: "Google" },
  facebook: { id: "facebook.com", instance: new FacebookAuthProvider(), label: "Facebook" },
};

export default function SocialConnections() {
  const [linked, setLinked] = useState({ google: false, facebook: false });
  const [msg, setMsg] = useState("");

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

  const handleLink = async (name) => {
    setMsg("");
    try {
      await linkWithPopup(auth.currentUser, providersMap[name].instance);
      setMsg(`✅ ${providersMap[name].label} conectado com sucesso.`);
      refreshStatus();
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  const handleUnlink = async (name) => {
    setMsg("");
    try {
      // Não é permitido remover o ÚNICO provedor vinculado à conta
      await unlink(auth.currentUser, providersMap[name].id);
      setMsg(`✅ ${providersMap[name].label} desconectado.`);
      refreshStatus();
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  const RenderRow = ({ name }) => (
    <div className="flex items-center justify-between border rounded p-2">
      <span>{providersMap[name].label}</span>
      {linked[name] ? (
        <button
          onClick={() => handleUnlink(name)}
          className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Desconectar
        </button>
      ) : (
        <button
          onClick={() => handleLink(name)}
          className="text-sm bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
        >
          Conectar
        </button>
      )}
    </div>
  );

  return (
    <section className="border rounded-2xl p-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Conectar redes sociais</h2>
      <div className="grid gap-2">
        <RenderRow name="google" />
        <RenderRow name="facebook" />
      </div>
      {msg && <p className="text-sm text-gray-600 mt-2">{msg}</p>}
      <p className="text-xs text-gray-400 mt-1">
        Dica: manter pelo menos um provedor conectado evita bloqueios de acesso.
      </p>
    </section>
  );
}
