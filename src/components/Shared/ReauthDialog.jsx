//← modal de reautenticação (email/senha ou social)


import { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../../services/firebase";

export default function ReauthDialog({ open, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const user = auth.currentUser;

  const handleEmailReauth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const cred = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, cred);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePopupReauth = async (providerName) => {
    setError("");
    try {
      const provider =
        providerName === "google"
          ? new GoogleAuthProvider()
          : new FacebookAuthProvider();
      await reauthenticateWithPopup(user, provider);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Reautenticação necessária
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Por segurança, confirme sua identidade para continuar.
        </p>

        <form onSubmit={handleEmailReauth} className="space-y-2">
          <input
            type="password"
            placeholder="Sua senha atual"
            className="w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white rounded p-2 hover:bg-gray-900"
          >
            Confirmar com Email/Senha
          </button>
        </form>

        <div className="flex items-center my-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-2 text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handlePopupReauth("google")}
            className="border rounded p-2 hover:bg-gray-50"
          >
            Google
          </button>
          <button
            onClick={() => handlePopupReauth("facebook")}
            className="border rounded p-2 hover:bg-gray-50"
          >
            Facebook
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button
          onClick={onClose}
          className="w-full mt-4 border rounded p-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
