import React, { useState, useEffect } from "react";
import { db, auth } from "../../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { gerarDieta } from "../../services/api";

export default function DietGenerator() {
  const [dados, setDados] = useState(null);
  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 1. Buscar dados salvos no Firestore
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "physicalAssessments", user.uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setDados(snap.data());
      } else {
        setError("Nenhuma avaliação física encontrada. Preencha seus dados primeiro.");
      }
    };
    fetchData();
  }, []);

  // 🔹 2. Gerar dieta inteligente via API GPT
const handleGenerateDiet = async () => {
  if (!dados) return;

  setLoading(true);
  setError("");
  try {
    // 👇 Aqui ele chama sua API GPT
    const planoGerado = await gerarDieta(dados);

    // 👇 Exibe o texto retornado na tela
    setDietPlan(planoGerado);
  } catch (err) {
    console.error("Erro ao gerar dieta:", err);
    setError("Ocorreu um erro ao gerar a dieta. Tente novamente.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 bg-gray-50 min-h-screen rounded-2xl">
      <h2 className="text-2xl font-bold text-yellow-600 mb-4">
        🍽️ Gerar Plano Alimentar Inteligente
      </h2>

      {!dados && !error && (
        <p className="text-gray-600">
          Carregando dados da avaliação física...
        </p>
      )}

      {error && (
        <p className="text-red-600 font-medium mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-700 font-medium mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          {success}
        </p>
      )}

      {dados && (
        <div className="bg-white shadow-sm rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            📋 Dados do Usuário
          </h3>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p>Altura: {dados.height} cm</p>
            <p>Peso: {dados.weight} kg</p>
            <p>Idade: {dados.age} anos</p>
            <p>Sexo: {dados.sex}</p>
            <p>TMB: {dados.tmbResult} kcal</p>
            <p>Objetivo: {dados.goal}</p>
            <p>Atividade: {dados.activityLevel}</p>
            <p>Refeições: {dados.meals}</p>
            <p>Treino: {dados.trainingType}</p>
            <p>Restrições: {dados.restrictions || "Nenhuma"}</p>
            <p>Suplementos: {dados.supplements || "Nenhum"}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleGenerateDiet}
        disabled={loading}
        className="bg-[#F5BA45] hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition w-full shadow-sm"
      >
        {loading ? "Gerando plano..." : "Gerar Plano Inteligente 🧠"}
      </button>

      {dietPlan && (
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 whitespace-pre-line">
          <h3 className="text-xl font-bold text-yellow-600 mb-3">
            🧠 Plano Alimentar Personalizado
          </h3>
          <p className="text-gray-700">{dietPlan}</p>
        </div>
      )}
    </div>
  );
}
