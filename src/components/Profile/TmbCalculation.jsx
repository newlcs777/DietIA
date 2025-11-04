import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData, updateUserData } from "../../store/userSlice";
import { motion } from "framer-motion";
import TmbInfo from "./TmbInfo";

export default function TmbCalculation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    height: "",
    weight: "",
    age: "",
    sex: "",
    goal: "Emagrecimento",
    meals: 6,
  });

  const [tmbResult, setTmbResult] = useState(null);
  const [macros, setMacros] = useState({ protein: 0, carb: 0, fat: 0 });
  const [statusMsg, setStatusMsg] = useState("");

  // 🔹 Busca inicial via Redux
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  // 🔹 Atualiza o formulário com dados do Redux
  useEffect(() => {
    if (userData && !loading) {
      setForm({
        height: userData.height ?? "",
        weight: userData.weight ?? "",
        age: userData.age ?? "",
        sex: userData.sex ?? "",
        goal: userData.goal ?? "Emagrecimento",
        meals: userData.meals ?? 6,
      });
      setTmbResult(userData.tmbResult ?? null);
      setMacros({
        protein: userData.protein ?? 0,
        carb: userData.carb ?? 0,
        fat: userData.fat ?? 0,
      });
    }
  }, [userData, loading]);

  // 🔸 Manipula inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["height", "weight"].includes(name) && value > 300) return;
    if (name === "age" && value > 100) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Cálculo da TMB
  const handleCalcular = async (e) => {
    e.preventDefault();
    setStatusMsg("⏳ Calculando...");

    const { height, weight, age, sex, goal } = form;
    if (!height || !weight || !age || !sex) {
      setStatusMsg("⚠️ Preencha todos os campos obrigatórios.");
      return;
    }

    let resultadoTmb =
      sex === "Masculino"
        ? 66 + 13.7 * weight + 5 * height - 6.8 * age
        : 655 + 9.6 * weight + 1.8 * height - 4.7 * age;

    if (goal === "Emagrecimento") resultadoTmb *= 0.85;
    if (goal === "Hipertrofia") resultadoTmb *= 1.15;

    const protein = Math.round(weight * 2);
    const fat = Math.round(weight * 0.8);
    const carb = Math.round((resultadoTmb - (protein * 4 + fat * 9)) / 4);

    const dadosAtualizados = {
      ...form,
      height: Number(height),
      weight: Number(weight),
      age: Number(age),
      tmbResult: Math.round(resultadoTmb),
      protein,
      carb,
      fat,
    };

    await dispatch(updateUserData(dadosAtualizados));

    setTmbResult(Math.round(resultadoTmb));
    setMacros({ protein, carb, fat });
    setStatusMsg("✅ Dados calculados e salvos com sucesso!");
  };

  const handleAvancar = () => navigate("/dashboard/avaliacao");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans text-gray-800"
    >
      {/* 🔹 Container principal */}
      <motion.div
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        className="p-4 sm:p-6 md:p-10 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm 
                   space-y-6 border border-gray-100 hover:shadow-md transition-all"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-[#F5BA45] text-center">
          ⚙️ Calculadora de TMB
        </h2>

        {/* 🔸 Formulário */}
        <form
          onSubmit={handleCalcular}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800"
        >
          <input
            type="number"
            name="height"
            placeholder="Altura (cm)"
            value={form.height}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
            required
          />
          <input
            type="number"
            name="weight"
            placeholder="Peso (kg)"
            value={form.weight}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Idade"
            value={form.age}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
            required
          />
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
            required
          >
            <option value="">Sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>

          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg p-2 w-full focus:ring-2 focus:ring-[#F5BA45]"
          >
            <option value="Emagrecimento">Emagrecimento</option>
            <option value="Hipertrofia">Hipertrofia</option>
            <option value="Manutenção">Manutenção</option>
          </select>

          <button
            type="submit"
            className="col-span-1 sm:col-span-2 bg-[#F5BA45] hover:bg-[#e2a93f] 
                       text-white font-semibold py-2 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            Calcular e Salvar TMB
          </button>
        </form>

        {/* 🔹 Resultado */}
        {tmbResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/70 rounded-xl p-5 sm:p-6 text-center space-y-2 shadow-sm border border-gray-100"
          >
            <p className="font-semibold text-lg">
              Sua TMB ajustada:{" "}
              <span className="text-[#F5BA45]">{tmbResult} kcal</span>
            </p>
            <p>Proteína: {macros.protein} g</p>
            <p>Carboidratos: {macros.carb} g</p>
            <p>Gordura: {macros.fat} g</p>

            <button
              onClick={handleAvancar}
              className="mt-4 bg-[#F5BA45] hover:bg-[#e4a834] text-white font-semibold 
                         px-6 py-2 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              Ir para próxima página ➜
            </button>
          </motion.div>
        )}

        {statusMsg && (
          <p className="text-center text-sm text-gray-600 font-medium">
            {statusMsg}
          </p>
        )}
      </motion.div>

      {/* 🔸 Seção informativa */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 md:p-10 rounded-2xl bg-white/70 backdrop-blur-md 
                   shadow-sm border border-gray-100"
      >
        <TmbInfo />
      </motion.div>
    </motion.div>
  );
}
