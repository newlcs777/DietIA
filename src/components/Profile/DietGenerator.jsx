import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "../../store/userSlice";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { gerarDieta } from "../../services/api";

export default function DietGenerator() {
  const dispatch = useDispatch();
  const { userData, loading: loadingUser } = useSelector((state) => state.user);

  const [dados, setDados] = useState(null);
  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 1. Buscar dados do Firestore + Redux
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData?.uid) {
          dispatch(fetchUserData());
          return;
        }

        const ref = doc(db, "physicalAssessments", userData.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setDados(snap.data());
        } else {
          setError("Nenhuma avaliação física encontrada. Preencha seus dados primeiro.");
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar seus dados.");
      }
    };

    if (!loadingUser) fetchData();
  }, [dispatch, userData, loadingUser]);

  // 🔹 2. Gerar dieta inteligente via API GPT
  const handleGenerateDiet = async () => {
    if (!dados) return;

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const planoGerado = await gerarDieta(dados);
      setDietPlan(planoGerado);
      setSuccess("✅ Plano alimentar gerado com sucesso!");
    } catch (err) {
      console.error("Erro ao gerar dieta:", err);
      setError("❌ Ocorreu um erro ao gerar a dieta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 bg-gray-50 min-h-screen rounded-2xl font-sans text-gray-800">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#F5BA45] mb-6 text-center">
        🍽️ Gerar Plano Alimentar Inteligente
      </h2>

      {/* Estado de carregamento inicial */}
      {loadingUser && (
        <p className="text-center text-gray-600 mb-4">Carregando dados do usuário...</p>
      )}

      {!dados && !error && !loadingUser && (
        <p className="text-center text-gray-600">
          Carregando dados da avaliação física...
        </p>
      )}

      {/* Mensagens de feedback */}
      {error && (
        <p className="text-red-600 font-medium mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-700 font-medium mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          {success}
        </p>
      )}

      {/* 🔸 Dados do usuário */}
      {dados && (
        <div className="bg-white shadow-sm rounded-2xl p-6 mb-6 border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4 text-lg flex items-center gap-2">
            📋 Dados do Usuário
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-sm sm:text-base">
            <p>Altura: <span className="font-medium">{dados.height} cm</span></p>
            <p>Peso: <span className="font-medium">{dados.weight} kg</span></p>
            <p>Idade: <span className="font-medium">{dados.age} anos</span></p>
            <p>Sexo: <span className="font-medium">{dados.sex}</span></p>
            <p>TMB: <span className="font-medium">{dados.tmbResult} kcal</span></p>
            <p>Objetivo: <span className="font-medium">{dados.goal}</span></p>
            <p>Atividade: <span className="font-medium">{dados.activityLevel}</span></p>
            <p>Refeições: <span className="font-medium">{dados.meals}</span></p>
            <p>Treino: <span className="font-medium">{dados.trainingType}</span></p>
            <p>Restrições: <span className="font-medium">{dados.restrictions || "Nenhuma"}</span></p>
            <p>Suplementos: <span className="font-medium">{dados.supplements || "Nenhum"}</span></p>
          </div>
        </div>
      )}

      {/* 🔸 Botão de ação */}
      <button
        onClick={handleGenerateDiet}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold text-white shadow-sm transition-all ${
          loading
            ? "bg-[#F5BA45]/70 cursor-not-allowed"
            : "bg-[#F5BA45] hover:bg-[#e4a834] hover:shadow-md active:scale-95"
        }`}
      >
        {loading ? "Gerando plano..." : "Gerar Plano Inteligente 🧠"}
      </button>

      {/* 🔸 Resultado da dieta */}
      {dietPlan && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 whitespace-pre-line">
          <h3 className="text-xl font-bold text-[#F5BA45] mb-3 text-center">
            🧠 Plano Alimentar Personalizado
          </h3>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{dietPlan}</p>
        </div>
      )}
    </div>
  );
}
