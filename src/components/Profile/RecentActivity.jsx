import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../services/firebase";
import {
  doc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { Clock, KeyRound, LogIn } from "lucide-react";
import { motion } from "framer-motion";

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
  const { userData } = useSelector((state) => state.user);
  const [lastLogin, setLastLogin] = useState("-");
  const [lastPassChange, setLastPassChange] = useState("-");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.uid) return;

    const fetchActivity = async () => {
      try {
        // Último login
        if (userData?.lastLogin) {
          setLastLogin(fmtDate(userData.lastLogin));
        }

        // 🔹 Busca última troca de senha no Firestore
        const auditRef = collection(doc(db, "users", userData.uid), "audit");
        const q = query(auditRef, orderBy("at", "desc"), limit(1));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const data = snap.docs[0].data();
          if (data.type === "password_change" && data.at?.toDate) {
            setLastPassChange(fmtDate(data.at.toDate()));
          }
        }
      } catch (err) {
        console.error("Erro ao buscar atividade:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userData]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md 
                 transition-all duration-300 p-6"
    >
      {/* 🔹 Título */}
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-5 h-5 text-[#F5BA45]" />
        <h2 className="text-xl font-semibold text-gray-800">
          Atividade Recente
        </h2>
      </div>

      {/* 🔸 Dados */}
      {loading ? (
        <p className="text-gray-500 text-sm animate-pulse">
          Carregando atividade...
        </p>
      ) : (
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
              <span className="text-gray-800 font-medium">
                {lastPassChange}
              </span>
            </span>
          </li>
        </ul>
      )}

      {/* 🔹 Observação */}
      <p className="text-xs text-gray-400 mt-4 leading-snug text-center sm:text-left">
        ⚠️ Alterações de senha são registradas automaticamente pelo sistema.
      </p>
    </motion.section>
  );
}
