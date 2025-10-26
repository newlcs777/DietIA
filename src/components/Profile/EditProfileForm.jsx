import { useState, useEffect } from "react";
import { db, auth } from "../../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

export default function EditProfileForm({ onCancel }) {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    goal: "",
    height: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Carregar dados do Firestore
  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            age: data.age || "",
            weight: data.weight || "",
            goal: data.goal || "",
            height: data.height || "",
          });
        }
      }
    };
    loadData();
  }, []);

  // 🔸 Atualizar valores
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 💾 Salvar dados
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = auth.currentUser;
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, formData, { merge: true });
      setMessage("✅ Dados salvos com sucesso!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao salvar os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-3xl 
                 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.08)]
                 p-6 sm:p-8 w-full max-w-lg mx-auto transition-all duration-300"
    >
      {/* 🔹 Título */}
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
        🧍 Editar Dados Físicos
      </h3>

      {/* 🔸 Formulário */}
      <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Idade
          </label>
          <input
            type="number"
            name="age"
            placeholder="Ex: 30"
            value={formData.age}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5BA45] transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Peso (kg)
          </label>
          <input
            type="number"
            name="weight"
            placeholder="Ex: 80"
            value={formData.weight}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5BA45] transition"
          />
        </div>

        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Altura (cm)
          </label>
          <input
            type="number"
            name="height"
            placeholder="Ex: 181"
            value={formData.height}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5BA45] transition"
          />
        </div>

        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Objetivo
          </label>
          <input
            type="text"
            name="goal"
            placeholder="Ex: emagrecer, ganhar massa, manter"
            value={formData.goal}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5BA45] transition"
          />
        </div>

        {/* 🔘 Botões */}
        <div className="flex justify-center gap-3 sm:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all ${
              loading
                ? "bg-[#F5BA45]/60 cursor-not-allowed"
                : "bg-[#F5BA45] hover:bg-[#e4a834] hover:shadow-md active:scale-95"
            }`}
          >
            {loading ? "Salvando..." : "💾 Salvar"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all active:scale-95"
          >
            ❌ Cancelar
          </button>
        </div>
      </form>

      {/* 🔹 Mensagem de feedback */}
      {message && (
        <p
          className={`mt-4 text-center text-sm font-medium ${
            message.includes("sucesso") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </motion.div>
  );
}
