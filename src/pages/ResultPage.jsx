import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gerarDieta } from "../services/api";
import Disclaimer from "../components/Profile/Disclaimer";
import { fetchUserData, updateUserData } from "../store/userSlice";

export default function ResultPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, loading } = useSelector((s) => s.user);

  const [editable, setEditable] = useState({});
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userData) setEditable({ ...userData });
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "meals" && value > 8) return;
    setEditable((p) => ({ ...p, [name]: value }));
  };

  const handleGerar = async () => {
    if (gerando) return;
    setGerando(true);
    setMsg("⏳ Gerando dieta...");
    setErr("");

    try {
      const diet = await gerarDieta({ ...userData, ...editable });

      const texto =
        typeof diet === "string"
          ? diet
          : diet?.[0]?.generated_text || JSON.stringify(diet);

      await dispatch(updateUserData({ ...editable, dietaGerada: texto }));

      setMsg("✅ Dieta gerada com sucesso!");
      navigate("/dashboard/dieta");
    } catch {
      setErr("❌ Erro ao gerar dieta.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-4 py-8 space-y-10 font-sans text-gray-800"
    >
      {/* Aviso */}
      <Disclaimer />

      {/* Dados principais */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#F5BA45]">
          Resultado Final
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { l: "Altura", v: `${userData.height || "-"} cm` },
            { l: "Peso", v: `${userData.weight || "-"} kg` },
            { l: "Idade", v: `${userData.age || "-"} anos` },
            { l: "TMB", v: `${Number(userData.tmbResult || 0).toFixed(0)} kcal` },
            {
              l: "Gordura Corporal",
              v: `${Number(userData.percentualGordura || 0).toFixed(2)}%`,
            },
          ].map((x, i) => (
            <div
              key={i}
              className="p-4 bg-gray-100 border border-gray-200 rounded-xl text-center"
            >
              <p className="text-gray-600 text-sm">{x.l}</p>
              <p className="font-semibold text-lg">{x.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campos editáveis */}
      <section className="space-y-6">
        {[
          { l: "Sexo", n: "gender", t: "select", o: ["Masculino", "Feminino"] },
          { l: "Objetivo", n: "goal", t: "select", o: ["Emagrecimento", "Manutenção", "Hipertrofia"] },
          { l: "Refeições por dia", n: "meals", t: "number", p: "Máx. 8" },
          { l: "Nível de treinamento", n: "activityLevel", t: "select", o: ["Sedentário", "Intermediário", "Avançado", "Profissional"] },
          { l: "Restrições alimentares", n: "restrictions", t: "text", p: "Ex: lactose, glúten..." },
          { l: "Treino atual", n: "trainingType", t: "text", p: "Ex: musculação, crossfit..." },
          { l: "Suplementos", n: "supplements", t: "text", p: "Ex: creatina, whey..." },
          { l: "Alimentos da rotina", n: "foods", t: "text", p: "Ex: arroz, frango, ovo..." },
        ].map((f, i) => (
          <div key={i} className="space-y-2">
            <label className="font-semibold">{f.l}:</label>
            {f.t === "select" ? (
              <select
                name={f.n}
                value={editable[f.n] || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
              >
                <option value="">Selecione</option>
                {f.o.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.t}
                name={f.n}
                value={editable[f.n] || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#F5BA45]"
                placeholder={f.p}
              />
            )}
          </div>
        ))}
      </section>

      <button
        onClick={handleGerar}
        disabled={gerando || loading}
        className="w-full bg-[#F5BA45] text-white font-semibold py-3 rounded-xl hover:bg-[#e4a834] transition-all disabled:bg-gray-400"
      >
        {gerando ? "Gerando Dieta..." : "Gerar Dieta Personalizada"}
      </button>

      {msg && <p className="text-center text-gray-600 font-medium">{msg}</p>}
      {err && <p className="text-center text-red-600 font-medium">{err}</p>}
    </motion.div>
  );
}
