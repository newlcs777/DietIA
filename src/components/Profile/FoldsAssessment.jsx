import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import PhysicalAssessmentInfo from "./PhysicalAssessmentInfo";
import { useUserData } from "../../contexts/UserDataContext";
import { useNavigate } from "react-router-dom";

export default function FoldsAssessment() {
  const navigate = useNavigate();
  const { userData, loadingUserData, updateUserData } = useUserData();

  const [age, setAge] = useState(0);
  const [subescapular, setSubescapular] = useState(0);
  const [triciptal, setTriciptal] = useState(0);
  const [axiliar, setAxiliar] = useState(0);
  const [supra, setSupra] = useState(0);
  const [peitoral, setPeitoral] = useState(0);
  const [abdominal, setAbdominal] = useState(0);
  const [coxa, setCoxa] = useState(0);

  const [resultado, setResultado] = useState(0);
  const [percentualGordura, setPercentualGordura] = useState(0);

  const [loadingPage, setLoadingPage] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [salvandoIdadeLive, setSalvandoIdadeLive] = useState(false);

  // 🔹 Carrega dados iniciais
  useEffect(() => {
    const carregar = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingPage(false);
        return;
      }

      try {
        const ref = doc(db, "physicalAssessments", user.uid);
        const snap = await getDoc(ref);

        const idadeInicial = userData?.age ?? (snap.exists() ? snap.data().age : 0);
        setAge(idadeInicial || 0);

        if (snap.exists()) {
          const dados = snap.data();
          setSubescapular(dados.subescapular || 0);
          setTriciptal(dados.triciptal || 0);
          setAxiliar(dados.axiliar || 0);
          setSupra(dados.supra || 0);
          setPeitoral(dados.peitoral || 0);
          setAbdominal(dados.abdominal || 0);
          setCoxa(dados.coxa || 0);
        }
      } catch (err) {
        console.error("Erro ao carregar avaliação física:", err);
      } finally {
        setLoadingPage(false);
      }
    };

    if (!loadingUserData) carregar();
  }, [loadingUserData, userData]);

  // 🔹 Recalcula soma e percentual de gordura
  useEffect(() => {
    const soma = subescapular + triciptal + axiliar + supra + peitoral + abdominal + coxa;
    setResultado(soma);

    if (age > 0 && soma > 0) {
      const densidade =
        1.112 -
        0.00043499 * soma +
        0.00000055 * Math.pow(soma, 2) -
        0.00028826 * age;

      const percentual = (4.95 / densidade - 4.5) * 100;
      setPercentualGordura(percentual);
    } else {
      setPercentualGordura(0);
    }
  }, [subescapular, triciptal, axiliar, supra, peitoral, abdominal, coxa, age]);

  // 🔹 Inputs das dobras
  const handleInput = (setter) => (e) => {
    const value = parseFloat(e.target.value);
    if (value > 100) return;
    setter(isNaN(value) ? 0 : value);
  };

  // 🔹 Salva avaliação física e redireciona
  const salvarAvaliacao = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      const dadosAvaliacao = {
        age: age || 0,
        subescapular,
        triciptal,
        axiliar,
        supra,
        peitoral,
        abdominal,
        coxa,
        resultado,
        percentualGordura: percentualGordura ? percentualGordura.toFixed(2) : "0",
        updatedAt: new Date().toISOString(),
      };

      // salva no Firestore
      await setDoc(doc(db, "physicalAssessments", user.uid), dadosAvaliacao, { merge: true });

      // atualiza contexto global
      await updateUserData({
        age: Number(age) || 0,
        percentualGordura: percentualGordura ? Number(percentualGordura.toFixed(2)) : 0,
        resultadoDobras: resultado || 0,
      });

      // salva também localmente (para o ResultPage exibir de imediato)
      localStorage.setItem("dadosAvaliacao", JSON.stringify(dadosAvaliacao));

      setMensagem("✅ Avaliação física salva e sincronizada!");

      // redireciona corretamente dentro do dashboard
      setTimeout(() => {
        navigate("/dashboard/resultado");
      }, 1000);
    } catch (err) {
      console.error("Erro ao salvar avaliação física:", err);
      setMensagem("❌ Erro ao salvar os dados.");
    }
  };

  // 🔹 Atualiza idade em tempo real
  const handleAgeChangeLive = async (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > 100) return;

    const idadeFinal = isNaN(val) ? 0 : val;
    setAge(idadeFinal);

    if (idadeFinal === userData?.age) return;

    try {
      setSalvandoIdadeLive(true);
      await updateUserData({ age: idadeFinal });
      setMensagem("💾 Idade atualizada no perfil!");
    } catch (err) {
      console.error("Erro ao salvar idade:", err);
      setMensagem("❌ Não foi possível salvar a idade agora.");
    } finally {
      setSalvandoIdadeLive(false);
    }
  };

  // 🔹 Tela de carregamento
  if (loadingUserData || loadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
        Carregando avaliação física...
      </div>
    );
  }

  // 🔹 Interface principal
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 font-sans text-gray-800"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Resultado Atual */}
        <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl shadow-inner text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5BA45]">
            Resultado Atual da Avaliação Física
          </h2>
          <p className="text-gray-700">
            Soma das dobras:{" "}
            <span className="font-bold text-gray-900">{resultado} mm</span>
          </p>
          <p className="text-gray-700">
            Percentual de gordura estimado:{" "}
            <span className="font-bold text-[#F5BA45]">
              {percentualGordura.toFixed(2)}%
            </span>
          </p>
        </div>

        {/* Formulário */}
        <section className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5BA45] text-center">
            Avaliação Física — 7 Dobras de Jackson & Pollock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Idade */}
            <div className="sm:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Idade:</label>
              <input
                type="number"
                value={age}
                onChange={handleAgeChangeLive}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#F5BA45]"
                placeholder="Digite sua idade (máx 100)"
                min="10"
                max="100"
              />
              {salvandoIdadeLive && (
                <p className="text-xs text-gray-500 mt-1">Salvando idade...</p>
              )}
            </div>

            {/* Entradas das dobras */}
            {[
              { label: "Subescapular", value: subescapular, setValue: setSubescapular },
              { label: "Triciptal", value: triciptal, setValue: setTriciptal },
              { label: "Axiliar", value: axiliar, setValue: setAxiliar },
              { label: "Supra-ilíaca", value: supra, setValue: setSupra },
              { label: "Peitoral", value: peitoral, setValue: setPeitoral },
              { label: "Abdominal", value: abdominal, setValue: setAbdominal },
              { label: "Coxa", value: coxa, setValue: setCoxa },
            ].map(({ label, value, setValue }, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-1">{label} (mm):</label>
                <input
                  type="number"
                  value={value}
                  onChange={handleInput(setValue)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#F5BA45]"
                  placeholder={`Medida (${label}) — máx 100`}
                  min="1"
                  max="100"
                />
              </div>
            ))}
          </div>

          {mensagem && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center font-medium ${
                mensagem.includes("✅")
                  ? "text-green-600"
                  : mensagem.includes("❌")
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {mensagem}
            </motion.p>
          )}

          {/* Botão principal */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={salvarAvaliacao}
            className="w-full mt-4 bg-[#F5BA45] hover:bg-[#e4a834] text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Salvar Avaliação e Ver Resultado
          </motion.button>
        </section>

        {/* Informações educativas */}
        <div className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100">
          <PhysicalAssessmentInfo />
        </div>
      </div>
    </motion.div>
  );
}
