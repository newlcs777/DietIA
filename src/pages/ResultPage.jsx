import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Disclaimer from "../components/Profile/Disclaimer";
import { motion } from "framer-motion";
import { gerarDieta } from "../services/api";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedData = JSON.parse(localStorage.getItem("dadosUsuario")) || {};

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

  useEffect(() => {
    const dadosCompletos = { ...initialState, ...editableFields };
    localStorage.setItem("dadosUsuario", JSON.stringify(dadosCompletos));
  }, [editableFields, initialState]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "meals" && Number(value) > 8) return; // Limite máximo de 8 refeições

    setEditableFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateDiet = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    setStatusMessage("⏳ Gerando dieta personalizada...");

    try {
      const diet = await gerarDieta({ ...initialState, ...editableFields });
      const textoPlano =
        typeof diet === "string"
          ? diet
          : diet?.[0]?.generated_text || JSON.stringify(diet, null, 2);

      localStorage.setItem("dietaGerada", textoPlano);
      const dadosCompletos = { ...initialState, ...editableFields };
      localStorage.setItem("dadosUsuario", JSON.stringify(dadosCompletos));

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
    <div className="min-h-screen bg-gradient-to-br from-[#fffdfa] via-gray-50 to-gray-100 font-sans text-gray-800 py-8 px-4 sm:px-6 lg:px-8">
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
        className="max-w-5xl mx-auto mt-8 bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10 space-y-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#F5BA45]">
          Resultado Final
        </h2>

        {/* 🔹 Informações Básicas */}
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

        {/* 🔸 Campos Editáveis */}
        <div className="space-y-6">
          {/* Sexo */}
          <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">Sexo:</label>
            <select
              name="gender"
              value={editableFields.gender}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>

          {/* Objetivo */}
          <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">Objetivo:</label>
            <select
              name="goal"
              value={editableFields.goal}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
            >
              <option value="">Selecione</option>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Condicionamento Físico">Condicionamento Físico</option>
              <option value="Hipertrofia">Hipertrofia</option>
            </select>
          </div>

          {/* Refeições */}
          <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">
              Número de refeições que deseja realizar no dia (máx. 8):
            </label>
            <input
              type="number"
              name="meals"
              min="1"
              max="8"
              value={editableFields.meals}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
              placeholder="Digite entre 1 e 8"
            />
          </div>

          {/* Atividade */}
          <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">
              Qual o seu nível de treinamento?
            </label>
            <select
              name="activityLevel"
              value={editableFields.activityLevel}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
            >
              <option value="">Selecione</option>
              <option value="Sedentário">Sedentário</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
              <option value="Profissional">Profissional</option>
            </select>
          </div>

          {/* Restrições */}
          <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">
              Existe alguma restrição alimentar?
            </label>
            <input
              type="text"
              name="restrictions"
              value={editableFields.restrictions}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
              placeholder="Exemplo: lactose, glúten, etc."
            />
          </div>

          {/* Treino */}
          <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">
              Escreva a modalidade de treino que realiza:
            </label>
            <input
              type="text"
              name="trainingType"
              value={editableFields.trainingType}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
              placeholder="Exemplo: musculação, corrida, crossfit..."
            />
          </div>

          {/* Suplementos */}
          <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">
              Quais suplementos você toma?
            </label>
            <input
              type="text"
              name="supplements"
              value={editableFields.supplements}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
              placeholder="Exemplo: whey, creatina, multivitamínico..."
            />
          </div>

          {/* Alimentos com autocomplete */}
          <div className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">
              Escreva detalhadamente os seus alimentos da rotina diária:
            </label>
            <input
              type="text"
              name="foods"
              list="foodSuggestions"
              value={editableFields.foods}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
              placeholder="Exemplo: arroz, feijão, frango, salada, banana..."
            />
            <datalist id="foodSuggestions">
              <option value="Arroz" />
              <option value="Feijão" />
              <option value="Frango" />
              <option value="Salada" />
              <option value="Ovo" />
              <option value="Banana" />
              <option value="Aveia" />
              <option value="Iogurte desnatado" />
              <option value="Batata doce" />
              <option value="Carne vermelha" />
            </datalist>
          </div>
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
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              />
              Gerando Dieta...
            </>
          ) : (
            "Gerar Dieta Personalizada"
          )}
        </button>

        {/* Mensagens */}
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
