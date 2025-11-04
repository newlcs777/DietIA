import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData, updateUserData } from "../../store/userSlice";
import TmbInfo from "./TmbInfo";
import { motion } from "framer-motion";

export default function TmbCalculation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

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

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
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
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalcular = async (e) => {
    e.preventDefault();

    const { height, weight, age, sex, goal } = form;
    if (!height || !weight || !age || !sex) {
      setStatusMsg("⚠️ Preencha todos os campos.");
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

    await dispatch(
      updateUserData({
        ...form,
        height: Number(height),
        weight: Number(weight),
        age: Number(age),
        tmbResult: Math.round(resultadoTmb),
        protein,
        carb,
        fat,
      })
    );

    setTmbResult(Math.round(resultadoTmb));
    setMacros({ protein, carb, fat });
    setStatusMsg("✅ Dados calculados e salvos!");
  };

  return (
    <motion.div className="space-y-10 w-full">
      <form
        onSubmit={handleCalcular}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input type="number" name="height" placeholder="Altura (cm)" value={form.height} onChange={handleChange} className="border rounded-lg p-2 w-full" />
        <input type="number" name="weight" placeholder="Peso (kg)" value={form.weight} onChange={handleChange} className="border rounded-lg p-2 w-full" />
        <input type="number" name="age" placeholder="Idade" value={form.age} onChange={handleChange} className="border rounded-lg p-2 w-full" />
        <select name="sex" value={form.sex} onChange={handleChange} className="border rounded-lg p-2 w-full">
          <option value="">Sexo</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
        </select>

        <select name="goal" value={form.goal} onChange={handleChange} className="border rounded-lg p-2 w-full">
          <option value="Emagrecimento">Emagrecimento</option>
          <option value="Hipertrofia">Hipertrofia</option>
          <option value="Manutenção">Manutenção</option>
        </select>

        <button
          type="submit"
          className="col-span-2 bg-[#F5BA45] text-white font-semibold py-2 rounded-lg"
        >
          Calcular e Salvar TMB
        </button>
      </form>

      {tmbResult && (
        <div className="text-center space-y-2">
          <p className="font-semibold text-lg">
            Sua TMB ajustada: <span className="text-[#F5BA45]">{tmbResult} kcal</span>
          </p>
          <p>Proteína: {macros.protein} g</p>
          <p>Carboidratos: {macros.carb} g</p>
          <p>Gordura: {macros.fat} g</p>
        </div>
      )}

      <TmbInfo />

      {statusMsg && <p className="text-center">{statusMsg}</p>}
    </motion.div>
  );
}
