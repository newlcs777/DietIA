import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { db, auth } from "../../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import PhysicalAssessmentInfo from "./PhysicalAssessmentInfo";

export default function FoldsAssessment() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    height,
    weight,
    age: initialAge,
    tmbResult,
    protein,
    carb,
    fat,
    sex,
    goal,
    meals,
    activityLevel,
    restrictions,
    trainingType,
    supplements,
    foods,
  } = location.state || {};

  const [age, setAge] = useState(initialAge || 0);
  const [subescapular, setSubescapular] = useState(0);
  const [triciptal, setTriciptal] = useState(0);
  const [axiliar, setAxiliar] = useState(0);
  const [supra, setSupra] = useState(0);
  const [peitoral, setPeitoral] = useState(0);
  const [abdominal, setAbdominal] = useState(0);
  const [coxa, setCoxa] = useState(0);
  const [resultado, setResultado] = useState(0);
  const [percentualGordura, setPercentualGordura] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");

  // 🔹 Carregar dados anteriores
  useEffect(() => {
    const carregarDados = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const ref = doc(db, "physicalAssessments", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const dados = snap.data();
          setSubescapular(dados.subescapular || 0);
          setTriciptal(dados.triciptal || 0);
          setAxiliar(dados.axiliar || 0);
          setSupra(dados.supra || 0);
          setPeitoral(dados.peitoral || 0);
          setAbdominal(dados.abdominal || 0);
          setCoxa(dados.coxa || 0);
          setAge(dados.age || age);
        }
      } catch (error) {
        console.error("Erro ao carregar dados da avaliação física:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  // 🔹 Calcular soma das dobras e percentual de gordura
  useEffect(() => {
    const soma =
      subescapular + triciptal + axiliar + supra + peitoral + abdominal + coxa;
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

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      const tmbRef = doc(db, "users", user.uid);
      const tmbSnap = await getDoc(tmbRef);
      const tmbData = tmbSnap.exists() ? tmbSnap.data() : {};

      const ref = doc(db, "physicalAssessments", user.uid);
      const safe = (v) => (v !== undefined ? v : 0);

      await setDoc(
        ref,
        {
          height: safe(height || tmbData.height),
          weight: safe(weight || tmbData.weight),
          age: safe(age || tmbData.age),
          subescapular: safe(subescapular),
          triciptal: safe(triciptal),
          axiliar: safe(axiliar),
          supra: safe(supra),
          peitoral: safe(peitoral),
          abdominal: safe(abdominal),
          coxa: safe(coxa),
          resultado: safe(resultado),
          percentualGordura: percentualGordura
            ? percentualGordura.toFixed(2)
            : 0,
          data: new Date().toISOString(),
        },
        { merge: true }
      );

      setMensagem("✅ Avaliação física salva com sucesso!");

      const dadosCompletos = {
        ...tmbData,
        height: height || tmbData.height || 0,
        weight: weight || tmbData.weight || 0,
        age: age || tmbData.age || 0,
        sex: tmbData.sex || "",
        goal: tmbData.goal || "",
        meals: tmbData.meals || 0,
        tmbResult: tmbData.tmbResult || 0,
        protein: tmbData.protein || 0,
        carb: tmbData.carb || 0,
        fat: tmbData.fat || 0,
        resultado,
        percentualGordura,
      };

      localStorage.setItem("dadosUsuario", JSON.stringify(dadosCompletos));
      navigate("/dashboard/resultado", { state: dadosCompletos });
    } catch (error) {
      console.error("Erro ao salvar avaliação física:", error);
      setMensagem("❌ Erro ao salvar os dados.");
    }
  };

  const handleInput = (setter) => (e) => {
    const value = parseFloat(e.target.value);
    if (value > 100) return; // ⛔ Limite máximo de 100
    setter(isNaN(value) ? 0 : value);
  };

  const measurements = [
    { label: "Subescapular", value: subescapular, setValue: setSubescapular },
    { label: "Triciptal", value: triciptal, setValue: setTriciptal },
    { label: "Axiliar", value: axiliar, setValue: setAxiliar },
    { label: "Supra-ilíaca", value: supra, setValue: setSupra },
    { label: "Peitoral", value: peitoral, setValue: setPeitoral },
    { label: "Abdominal", value: abdominal, setValue: setAbdominal },
    { label: "Coxa", value: coxa, setValue: setCoxa },
  ];

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
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto space-y-8 font-sans text-gray-800">

        {/* 🟡 Tabela de Resultados no Topo */}
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

        {/* 🔹 Formulário principal */}
        <section className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5BA45] text-center">
            Avaliação Física — 7 Dobras de Jackson & Pollock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Idade:
              </label>
              <input
                type="number"
                value={age}
                onChange={handleInput(setAge)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#F5BA45]"
                placeholder="Digite sua idade (máx 100)"
                min="10"
                max="100"
              />
            </div>

            {measurements.map(({ label, value, setValue }, index) => (
              <div key={index}>
                <label className="block text-gray-700 font-medium mb-1">
                  {label} (mm):
                </label>
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
                mensagem.includes("sucesso")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {mensagem}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="w-full mt-4 bg-[#F5BA45] hover:bg-[#e4a834] text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Salvar Avaliação e Ver Resultado
          </motion.button>
        </section>

        {/* 🔸 Informações adicionais no final */}
        <div className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100">
          <PhysicalAssessmentInfo />
        </div>
      </div>
    </motion.div>
  );
}
