import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PhysicalAssessmentInfo from "./PhysicalAssessmentInfo";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData, updateUserData } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function FoldsAssessment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.user);

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
  const [mensagem, setMensagem] = useState("");
  const [salvandoIdadeLive, setSalvandoIdadeLive] = useState(false);

  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData());
    } else {
      setAge(userData.age ?? 0);
      setSubescapular(userData.subescapular ?? 0);
      setTriciptal(userData.triciptal ?? 0);
      setAxiliar(userData.axiliar ?? 0);
      setSupra(userData.supra ?? 0);
      setPeitoral(userData.peitoral ?? 0);
      setAbdominal(userData.abdominal ?? 0);
      setCoxa(userData.coxa ?? 0);
    }
  }, [dispatch, userData]);

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

  const handleInput = (setter) => (e) => {
    const value = parseFloat(e.target.value);
    if (value > 100) return;
    setter(isNaN(value) ? 0 : value);
  };

  const salvarAvaliacao = async () => {
    try {
      const dadosAvaliacao = {
        age,
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

      await dispatch(updateUserData(dadosAvaliacao)).unwrap();
      localStorage.setItem("dadosAvaliacao", JSON.stringify(dadosAvaliacao));

      setMensagem("✅ Avaliação física salva com sucesso!");
      setTimeout(() => navigate("/dashboard/resultado"), 800);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setMensagem("❌ Erro ao salvar os dados.");
    }
  };

  const handleAgeChangeLive = async (e) => {
    const val = parseInt(e.target.value, 10);
    if (val > 100) return;

    setAge(isNaN(val) ? 0 : val);
    if (val === userData.age) return;

    try {
      setSalvandoIdadeLive(true);
      await dispatch(updateUserData({ age: val })).unwrap();
      setMensagem("💾 Idade atualizada!");
    } finally {
      setSalvandoIdadeLive(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
        Carregando avaliação física...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10 font-sans"
    >
      {/* Resultado Atual */}
      <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-200">
        <h2 className="text-xl font-bold text-[#F5BA45]">Resultado da Avaliação Física</h2>
        <p>Soma das dobras: <strong>{resultado} mm</strong></p>
        <p>Percentual estimado de gordura: <strong className="text-[#F5BA45]">{percentualGordura.toFixed(2)}%</strong></p>
      </div>

      {/* Formulário */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#F5BA45] text-center">
          7 Dobras — Jackson & Pollock
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="sm:col-span-2">
            <label className="font-medium text-gray-700">Idade:</label>
            <input
              type="number"
              value={age}
              onChange={handleAgeChangeLive}
              className="w-full p-3 border rounded-lg focus:ring-[#F5BA45]"
            />
            {salvandoIdadeLive && <p className="text-xs text-gray-500">Salvando...</p>}
          </div>

          {[
            { label: "Subescapular", value: subescapular, setValue: setSubescapular },
            { label: "Triciptal", value: triciptal, setValue: setTriciptal },
            { label: "Axiliar", value: axiliar, setValue: setAxiliar },
            { label: "Supra-ilíaca", value: supra, setValue: setSupra },
            { label: "Peitoral", value: peitoral, setValue: setPeitoral },
            { label: "Abdominal", value: abdominal, setValue: setAbdominal },
            { label: "Coxa", value: coxa, setValue: setCoxa },
          ].map(({ label, value, setValue }, i) => (
            <div key={i}>
              <label className="block text-gray-700 font-medium">{label} (mm):</label>
              <input
                type="number"
                value={value}
                onChange={handleInput(setValue)}
                className="w-full p-3 border rounded-lg focus:ring-[#F5BA45]"
                placeholder={`Medida (${label})`}
              />
            </div>
          ))}
        </div>

        {mensagem && (
          <p
            className={`text-center font-medium ${
              mensagem.includes("✅")
                ? "text-green-600"
                : mensagem.includes("❌")
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {mensagem}
          </p>
        )}

        <button
          onClick={salvarAvaliacao}
          className="w-full bg-[#F5BA45] text-white py-3 rounded-xl font-bold hover:bg-[#e1a028]"
        >
          Salvar Avaliação e Ver Resultado
        </button>
      </section>

      {/* Informações Extras */}
      <PhysicalAssessmentInfo />
    </motion.div>
  );
}
