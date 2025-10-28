import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import TmbInfo from "./TmbInfo";

export default function TmbCalculation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    sex: "",
    goal: "Emagrecimento",
    meals: 6,
  });

  const [tmbResult, setTmbResult] = useState(null);
  const [protein, setProtein] = useState(null);
  const [carb, setCarb] = useState(null);
  const [fat, setFat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setFormData({
            height: data.height || "",
            weight: data.weight || "",
            age: data.age || "",
            sex: data.sex || "",
            goal: data.goal || "Emagrecimento",
            meals: data.meals || 6,
          });
          setTmbResult(data.tmbResult || null);
          setProtein(data.protein || null);
          setCarb(data.carb || null);
          setFat(data.fat || null);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do Firestore:", error);
      }
    };
    carregarDados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🧩 Validação de campos numéricos
    if (name === "height" && value > 300) return; // máx 3m
    if (name === "weight" && value > 300) return; // máx 300kg
    if (name === "age" && value > 100) return; // máx 100 anos

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calcularTmb = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    const { height, weight, age, sex, goal } = formData;
    if (!height || !weight || !age || !sex) {
      setLoading(false);
      return;
    }

    let resultadoTmb;
    if (sex === "Masculino") {
      resultadoTmb = 66 + 13.7 * weight + 5 * height - 6.8 * age;
    } else {
      resultadoTmb = 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
    }

    let tmbAjustado = resultadoTmb;
    if (goal === "Emagrecimento") tmbAjustado *= 0.85;
    if (goal === "Hipertrofia") tmbAjustado *= 1.15;

    const proteina = (weight * 2).toFixed(0);
    const gordura = (weight * 0.8).toFixed(0);
    const carboidrato = (
      (tmbAjustado - (proteina * 4 + gordura * 9)) / 4
    ).toFixed(0);

    setTmbResult(tmbAjustado.toFixed(0));
    setProtein(proteina);
    setCarb(carboidrato);
    setFat(gordura);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado.");

      const ref = doc(db, "users", user.uid);
      await setDoc(
        ref,
        {
          height: Number(height),
          weight: Number(weight),
          age: Number(age),
          sex,
          goal,
          meals: Number(formData.meals),
          tmbResult: tmbAjustado.toFixed(0),
          protein: proteina,
          carb: carboidrato,
          fat: gordura,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setSuccessMsg("✅ Dados salvos com sucesso no seu perfil!");
    } catch (error) {
      console.error("Erro ao salvar TMB:", error);
      setSuccessMsg("❌ Erro ao salvar os dados no banco.");
    } finally {
      setLoading(false);
    }
  };

  const irParaProximaPagina = () => navigate("/dashboard/avaliacao");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans text-gray-800">

      {/* 🔹 Calculadora de TMB (AGORA NO TOPO) */}
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5BA45] text-center">
          ⚙️ Calculadora de TMB
        </h2>

        <form
          onSubmit={calcularTmb}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800"
        >
          <input
            type="number"
            name="height"
            placeholder="Altura (cm) — máx 300"
            value={formData.height}
            onChange={handleChange}
            min="50"
            max="300"
            step="1"
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
            required
          />
          <input
            type="number"
            name="weight"
            placeholder="Peso (kg) — máx 300"
            value={formData.weight}
            onChange={handleChange}
            min="20"
            max="300"
            step="0.1"
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Idade (anos) — máx 100"
            value={formData.age}
            onChange={handleChange}
            min="10"
            max="100"
            step="1"
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
            required
          />
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
            required
          >
            <option value="">Sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
          >
            <option value="Emagrecimento">Emagrecimento</option>
            <option value="Hipertrofia">Hipertrofia</option>
            <option value="Manutenção">Manutenção</option>
          </select>
        

          <button
            type="submit"
            disabled={loading}
            className={`col-span-1 sm:col-span-2 ${
              loading ? "bg-gray-400" : "bg-[#F5BA45] hover:bg-[#e2a93f]"
            } text-white font-semibold py-2 rounded-lg transition w-full`}
          >
            {loading ? "Salvando..." : "Calcular e Salvar TMB"}
          </button>
        </form>

        {tmbResult && (
          <div className="bg-gray-50 border rounded-xl p-4 sm:p-6 text-center text-gray-800 space-y-2">
            <p className="font-semibold text-lg">
              Sua TMB ajustada:{" "}
              <span className="text-[#F5BA45]">{tmbResult} kcal</span>
            </p>
            <p>Proteína: {protein} g</p>
            <p>Carboidratos: {carb} g</p>
            <p>Gordura: {fat} g</p>

            <button
              onClick={irParaProximaPagina}
              className="mt-4 bg-[#F5BA45] hover:bg-[#e2a93f] text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Ir para próxima página ➜
            </button>
          </div>
        )}

        {successMsg && (
          <p className="text-center text-sm text-gray-600 font-medium">
            {successMsg}
          </p>
        )}
      </div>

      {/* 🔸 Informações sobre TMB (AGORA ABAIXO) */}
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100">
        <TmbInfo />
      </div>
    </div>
  );
}
