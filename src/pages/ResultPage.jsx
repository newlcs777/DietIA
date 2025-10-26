import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Disclaimer from "../components/Profile/Disclaimer";
import { motion } from "framer-motion";
import { gerarDieta } from "../services/api";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Busca dados do localStorage (se existirem)
  const savedData = JSON.parse(localStorage.getItem("dadosUsuario")) || {};

  // 🔹 Usa dados vindos da navegação (location.state) ou do localStorage
  const initialState = location.state || savedData || {
    height: 0,
    weight: 0,
    age: 0,
    gender: "",
    tmbResult: 0,
    percentualGordura: 0,
    goal: "",
    meals: "",
    activityLevel: "",
    restrictions: "",
    trainingType: "",
    supplements: "",
    foods: "",
  };

  const [editableFields, setEditableFields] = useState({
    gender: initialState.gender || "",
    goal: initialState.goal || "",
    meals: initialState.meals || "",
    activityLevel: initialState.activityLevel || "",
    restrictions: initialState.restrictions || "",
    trainingType: initialState.trainingType || "",
    supplements: initialState.supplements || "",
    foods: initialState.foods || "",
    percentualGordura: initialState.percentualGordura || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // 🧠 Sempre que algo mudar, salva tudo no localStorage
  useEffect(() => {
    const dadosCompletos = { ...initialState, ...editableFields };
    localStorage.setItem("dadosUsuario", JSON.stringify(dadosCompletos));
  }, [editableFields, initialState]);

  // 🔹 Atualiza campos editáveis
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableFields((prev) => ({
      ...prev,
      [name]: value === "" ? "" : isNaN(value) ? value : Number(value),
    }));
  };

  // 🚀 Gera a dieta via API, salva e redireciona
  const handleGenerateDiet = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    setStatusMessage("⏳ Gerando dieta... isso pode levar alguns segundos.");

    try {
      const diet = await gerarDieta({ ...initialState, ...editableFields });
      const textoPlano =
        typeof diet === "string"
          ? diet
          : diet?.[0]?.generated_text || JSON.stringify(diet, null, 2);

      // 🔹 Salva no localStorage
      localStorage.setItem("dietaGerada", textoPlano);

      // 🔹 Salva também os dados mais recentes
      const dadosCompletos = { ...initialState, ...editableFields };
      localStorage.setItem("dadosUsuario", JSON.stringify(dadosCompletos));

      // 🔹 Redireciona para página Dieta IA
      setStatusMessage("✅ Dieta gerada com sucesso!");
      navigate("/dashboard/dieta");
    } catch (err) {
      console.error("❌ Erro ao gerar dieta:", err);
      const status = err?.response?.status;

      if (status === 429) {
        setError("⚠️ Muitas requisições. Aguarde alguns segundos e tente novamente.");
      } else if (status === 500) {
        setError("⚠️ O modelo está carregando. Tente novamente em instantes.");
      } else {
        setError("❌ Ocorreu um erro ao gerar a dieta. Tente novamente mais tarde.");
      }

      setStatusMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffdfa] via-gray-50 to-gray-100 font-sans text-gray-800 py-10 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Disclaimer />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-3xl mx-auto mt-10 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10 space-y-8"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#F5BA45]">
          Resultado Final
        </h2>

        {/* 🔹 Informações básicas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Altura", value: `${initialState.height} cm` },
            { label: "Peso", value: `${initialState.weight} kg` },
            { label: "Idade", value: `${initialState.age} anos` },
            { label: "TMB", value: `${Number(initialState.tmbResult).toFixed(0)} kcal` },
            {
              label: "Gordura Corporal",
              value: `${Number(initialState.percentualGordura).toFixed(2)}%`,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="w-full p-4 bg-gray-50 rounded-2xl shadow-inner flex flex-col items-center justify-center"
            >
              <p className="text-gray-600 text-sm">{item.label}</p>
              <p className="text-gray-900 font-semibold text-lg mt-1">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* 🔸 Campos editáveis */}
        <div className="space-y-4">
          {[
            { label: "Sexo", name: "gender" },
            { label: "Objetivo", name: "goal" },
            { label: "Refeições", name: "meals" },
            { label: "Atividade", name: "activityLevel" },
            { label: "Restrições", name: "restrictions" },
            { label: "Treino", name: "trainingType" },
            { label: "Suplementos", name: "supplements" },
            { label: "Alimentos", name: "foods" },
          ].map((item, index) => (
            <div
              key={index}
              className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <label
                htmlFor={item.name}
                className="block mb-1 font-semibold text-gray-700"
              >
                {item.label}
              </label>
              <input
                type="text"
                id={item.name}
                name={item.name}
                value={editableFields[item.name]}
                onChange={handleInputChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F5BA45] bg-white text-gray-800"
                placeholder={`Digite ${item.label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        {/* 🔹 Botão principal */}
        <button
          onClick={handleGenerateDiet}
          disabled={loading}
          className="w-full bg-[#F5BA45] hover:bg-[#e2a93f] text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
              Gerando Dieta...
            </>
          ) : (
            "Gerar Dieta Personalizada"
          )}
        </button>

        {/* 🔸 Mensagens */}
        {statusMessage && (
          <p className="text-center text-gray-600 font-medium mt-4">{statusMessage}</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-medium mt-2">{error}</p>
        )}
      </motion.div>
    </div>
  );
}
