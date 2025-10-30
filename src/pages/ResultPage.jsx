import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Disclaimer from "../components/Profile/Disclaimer";
import { motion } from "framer-motion";
import { gerarDieta } from "../services/api";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Função que junta dados de todas as páginas
  const getAllData = () => {
    const dadosUsuario = JSON.parse(localStorage.getItem("dadosUsuario")) || {};
    const dadosTmb = JSON.parse(localStorage.getItem("dadosTmb")) || {};
    const dadosAvaliacao = JSON.parse(localStorage.getItem("dadosAvaliacao")) || {};
    const dadosPerfil = JSON.parse(localStorage.getItem("userProfile")) || {};
    const stateData = location.state || {};

    return {
      ...dadosUsuario,
      ...dadosTmb,
      ...dadosAvaliacao,
      ...dadosPerfil,
      ...stateData,
    };
  };

  const [dados, setDados] = useState(getAllData());
  const [editableFields, setEditableFields] = useState({
    gender: dados.gender || dados.sex || "",
    goal: dados.goal || "",
    meals: dados.meals || "",
    activityLevel: dados.activityLevel || "",
    restrictions: dados.restrictions || "",
    trainingType: dados.trainingType || "",
    supplements: dados.supplements || "",
    foods: dados.foods || "",
    percentualGordura: dados.percentualGordura || dados.bodyFat || 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // ✅ Atualiza dados automaticamente a cada 500ms
  useEffect(() => {
    const intervalo = setInterval(() => {
      const novosDados = getAllData();

      // só atualiza se algo realmente mudou
      if (JSON.stringify(novosDados) !== JSON.stringify(dados)) {
        setDados(novosDados);
        const dadosCompletos = { ...novosDados, ...editableFields };
        localStorage.setItem("dadosUsuario", JSON.stringify(dadosCompletos));
      }
    }, 500); // atualização suave e leve

    return () => clearInterval(intervalo);
  }, [dados, editableFields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "meals" && Number(value) > 8) return;
    setEditableFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateDiet = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    setStatusMessage("⏳ Gerando dieta personalizada...");

    try {
      const diet = await gerarDieta({ ...dados, ...editableFields });
      const textoPlano =
        typeof diet === "string"
          ? diet
          : diet?.[0]?.generated_text || JSON.stringify(diet, null, 2);

      localStorage.setItem("dietaGerada", textoPlano);
      setStatusMessage("✅ Dieta gerada com sucesso!");
      navigate("/dashboard/dieta");
    } catch (err) {
      console.error("❌ Erro ao gerar dieta:", err);
      setError("❌ Ocorreu um erro. Tente novamente mais tarde.");
      setStatusMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffdfa] via-gray-50 to-gray-100 font-sans text-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Disclaimer />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl shadow-md p-5 sm:p-10 space-y-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#F5BA45]">
          Resultado Final
        </h2>

        {/* 🔹 Dados principais */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Altura", value: `${dados.height || "-"} cm` },
            { label: "Peso", value: `${dados.weight || "-"} kg` },
            { label: "Idade", value: `${dados.age || "-"} anos` },
            {
              label: "TMB",
              value: `${Number(dados.tmbResult || 0).toFixed(0)} kcal`,
            },
            {
              label: "Gordura Corporal",
              value: `${Number(dados.percentualGordura || 0).toFixed(2)}%`,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="w-full p-4 bg-gray-50 rounded-2xl shadow-sm flex flex-col items-center justify-center"
            >
              <p className="text-gray-600 text-sm">{item.label}</p>
              <p className="text-gray-900 font-semibold text-lg mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* 🔸 Campos editáveis */}
        <div className="space-y-6">
          {[
            { label: "Sexo", name: "gender", type: "select", options: ["Masculino", "Feminino"] },
            { label: "Objetivo", name: "goal", type: "select", options: ["Emagrecimento", "Manutenção", "Hipertrofia"] },
            { label: "Refeições por dia", name: "meals", type: "number", placeholder: "Máx. 8" },
            { label: "Nível de treinamento", name: "activityLevel", type: "select", options: ["Sedentário", "Intermediário", "Avançado", "Profissional"] },
            { label: "Restrições alimentares", name: "restrictions", type: "text", placeholder: "Ex: lactose, glúten..." },
            { label: "Treino atual", name: "trainingType", type: "text", placeholder: "Ex: musculação, corrida..." },
            { label: "Suplementos", name: "supplements", type: "text", placeholder: "Ex: whey, creatina..." },
            { label: "Alimentos da rotina", name: "foods", type: "text", placeholder: "Ex: arroz, frango, banana..." },
          ].map((item, i) => (
            <div key={i} className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
              <label className="block mb-2 font-semibold text-gray-700">{item.label}:</label>
              {item.type === "select" ? (
                <select
                  name={item.name}
                  value={editableFields[item.name]}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
                >
                  <option value="">Selecione</option>
                  {item.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={item.type}
                  name={item.name}
                  value={editableFields[item.name]}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
                  placeholder={item.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        {/* 🔹 Botão */}
        <button
          onClick={handleGenerateDiet}
          disabled={loading}
          className="w-full bg-[#F5BA45] hover:bg-[#e2a93f] text-white font-semibold py-3 rounded-2xl shadow-md transition-all duration-300 disabled:bg-gray-400"
        >
          {loading ? "Gerando Dieta..." : "Gerar Dieta Personalizada"}
        </button>

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
