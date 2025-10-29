import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TmbInfo from "./TmbInfo";
import { useUserData } from "../../contexts/UserDataContext";

export default function TmbCalculation() {
  const navigate = useNavigate();
  const { userData, loadingUserData, updateUserData } = useUserData();

  // estado local só pra edição do formulário
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    sex: "",
    goal: "Emagrecimento",
    meals: 6,
  });

  // resultados calculados
  const [tmbResult, setTmbResult] = useState(null);
  const [protein, setProtein] = useState(null);
  const [carb, setCarb] = useState(null);
  const [fat, setFat] = useState(null);

  const [loadingCalc, setLoadingCalc] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // quando userData chega/atualiza, joga pro formulário
  useEffect(() => {
    if (!loadingUserData && userData) {
      setFormData({
        height: userData.height ?? "",
        weight: userData.weight ?? "",
        age: userData.age ?? "",
        sex: userData.sex ?? "",
        goal: userData.goal ?? "Emagrecimento",
        meals: userData.meals ?? 6,
      });

      setTmbResult(userData.tmbResult ?? null);
      setProtein(userData.protein ?? null);
      setCarb(userData.carb ?? null);
      setFat(userData.fat ?? null);
    }
  }, [userData, loadingUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "height" && value > 300) return;
    if (name === "weight" && value > 300) return;
    if (name === "age" && value > 100) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calcularTmbESalvar = async (e) => {
    e.preventDefault();
    setLoadingCalc(true);
    setSuccessMsg("");

    const { height, weight, age, sex, goal, meals } = formData;
    if (!height || !weight || !age || !sex) {
      setLoadingCalc(false);
      return;
    }

    // cálculo TMB
    let resultadoTmb;
    if (sex === "Masculino") {
      resultadoTmb = 66 + 13.7 * weight + 5 * height - 6.8 * age;
    } else {
      resultadoTmb = 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
    }

    let tmbAjustado = resultadoTmb;
    if (goal === "Emagrecimento") tmbAjustado *= 0.85;
    if (goal === "Hipertrofia") tmbAjustado *= 1.15;

    // macros
    const proteinaCalc = (weight * 2).toFixed(0);
    const gorduraCalc = (weight * 0.8).toFixed(0);
    const carboCalc = (
      (tmbAjustado - (proteinaCalc * 4 + gorduraCalc * 9)) / 4
    ).toFixed(0);

    // atualiza UI local
    const tmbStr = tmbAjustado.toFixed(0);
    setTmbResult(tmbStr);
    setProtein(proteinaCalc);
    setCarb(carboCalc);
    setFat(gorduraCalc);

    // salva globalmente no Firestore
    await updateUserData({
      height: Number(height),
      weight: Number(weight),
      age: Number(age),
      sex,
      goal,
      meals: Number(meals),
      tmbResult: tmbStr,
      protein: proteinaCalc,
      carb: carboCalc,
      fat: gorduraCalc,
    });

    setSuccessMsg("✅ Dados salvos com sucesso!");
    setLoadingCalc(false);
  };

  const irParaProximaPagina = () => navigate("/dashboard/avaliacao");

  if (loadingUserData && !userData) {
    return (
      <div className="text-center text-gray-600 py-10">
        Carregando seus dados...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans text-gray-800">
      {/* 🔹 Calculadora de TMB */}
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5BA45] text-center">
          ⚙️ Calculadora de TMB
        </h2>

        <form
          onSubmit={calcularTmbESalvar}
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
            disabled={loadingCalc}
            className={`col-span-1 sm:col-span-2 ${
              loadingCalc
                ? "bg-gray-400"
                : "bg-[#F5BA45] hover:bg-[#e2a93f]"
            } text-white font-semibold py-2 rounded-lg transition w-full`}
          >
            {loadingCalc ? "Salvando..." : "Calcular e Salvar TMB"}
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
              className="mt-4 bg-[#F5BA45] hover:bg-[#e2a93f] text-white font-semibold px-6 py-2 rounded-lg transition w-full sm:w-auto"
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

      {/* 🔸 Bloco educacional */}
      <div className="bg-white p-4 sm:p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100">
        <TmbInfo />
      </div>
    </div>
  );
}
