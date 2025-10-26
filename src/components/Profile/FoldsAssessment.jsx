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

  // 🔹 Carregar dados anteriores de avaliação (se existirem)
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

  // 🚀 Salvar avaliação e redirecionar com dados completos
  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    try {
      // 🔸 1. Buscar dados da TMB salvos no Firestore
      const tmbRef = doc(db, "users", user.uid);
      const tmbSnap = await getDoc(tmbRef);
      const tmbData = tmbSnap.exists() ? tmbSnap.data() : {};

      // 🔸 2. Salvar a avaliação física no Firestore
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

      // 🔸 3. Combinar dados de TMB + Avaliação Física
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
        activityLevel: tmbData.activityLevel || "",
        restrictions: tmbData.restrictions || "",
        trainingType: tmbData.trainingType || "",
        supplements: tmbData.supplements || "",
        foods: tmbData.foods || "",
        resultado,
        percentualGordura,
      };

      // 🔸 4. Salvar no localStorage
      localStorage.setItem("dadosUsuario", JSON.stringify(dadosCompletos));

      // 🔸 5. Redirecionar para a página de resultado
      navigate("/dashboard/resultado", {
        state: dadosCompletos,
      });
    } catch (error) {
      console.error("Erro ao salvar avaliação física:", error);
      setMensagem("❌ Erro ao salvar os dados.");
    }
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
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4"
    >
      <div className="max-w-3xl mx-auto space-y-10 font-sans text-gray-800">
        <PhysicalAssessmentInfo />

        <section className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5BA45] text-center mb-8">
            Avaliação Física — 7 Dobras de Jackson & Pollock
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Idade:
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F5BA45] outline-none transition"
                placeholder="Digite sua idade"
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
                  onChange={(e) => setValue(parseFloat(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F5BA45] outline-none transition"
                  placeholder={`Digite a medida (${label})`}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-100 p-6 rounded-2xl shadow-inner text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados:
            </h3>
            <p className="text-gray-700">
              Soma das dobras:{" "}
              <span className="font-bold text-gray-900">{resultado} mm</span>
            </p>
            <p className="text-gray-700">
              Percentual de gordura:{" "}
              <span className="font-bold text-[#F5BA45]">
                {percentualGordura.toFixed(2)}%
              </span>
            </p>
          </div>

          {mensagem && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center mt-4 font-medium ${
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
            className="w-full mt-6 bg-[#F5BA45] hover:bg-[#e4a834] text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Salvar Avaliação e Ver Resultado
          </motion.button>
        </section>
      </div>
    </motion.div>
  );
}
