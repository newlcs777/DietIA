import { useEffect, useState } from "react";
import { auth, db } from "../../services/firebase";
import {
  doc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { Clock, KeyRound, LogIn } from "lucide-react";

function fmtDate(s) {
  try {
    return new Date(s).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

export default function RecentActivity() {
  const [lastLogin, setLastLogin] = useState("-");
  const [lastPassChange, setLastPassChange] = useState("-");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // 🔹 Último login
    if (user.metadata?.lastSignInTime) {
      setLastLogin(fmtDate(user.metadata.lastSignInTime));
    }

    // 🔹 Última troca de senha
    (async () => {
      try {
        const auditRef = collection(doc(db, "users", user.uid), "audit");
        const q = query(auditRef, orderBy("at", "desc"), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const d = snap.docs[0].data();
          if (d.type === "password_change" && d.at?.toDate) {
            setLastPassChange(fmtDate(d.at.toDate()));
          }
        }
      } catch {
        // Sem log, mantém "-"
      }
    })();
  }, []);

  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      {/* 🔹 Título */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[#F5BA45]" />
        <h2 className="text-xl font-semibold text-gray-800">
          Atividade Recente
        </h2>
      </div>

      {/* 🔸 Informações */}
      <ul className="space-y-3 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          <LogIn className="w-4 h-4 text-gray-500" />
          <span>
            <strong>Último login:</strong>{" "}
            <span className="text-gray-800 font-medium">{lastLogin}</span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-gray-500" />
          <span>
            <strong>Senha alterada:</strong>{" "}
            <span className="text-gray-800 font-medium">{lastPassChange}</span>
          </span>
        </li>
      </ul>

      {/* 🔹 Observação */}
      <p className="text-xs text-gray-400 mt-4 leading-snug text-center sm:text-left">
        ⚠️ As alterações de senha são registradas automaticamente pelo sistema.
      </p>
    </section>
  );
}
