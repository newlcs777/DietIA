import TmbCalculation from "../components/Profile/TmbCalculation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardProfile() {
  // 📊 Dados de calorias (mock para exemplo)
  const data = [
    { dia: "Seg", consumidas: 2200, gastas: 2400 },
    { dia: "Ter", consumidas: 2000, gastas: 2300 },
    { dia: "Qua", consumidas: 2500, gastas: 2200 },
    { dia: "Qui", consumidas: 2100, gastas: 2600 },
    { dia: "Sex", consumidas: 2300, gastas: 2500 },
    { dia: "Sáb", consumidas: 2600, gastas: 2700 },
    { dia: "Dom", consumidas: 2400, gastas: 2300 },
  ];

  const totalConsumidas = data.reduce((acc, d) => acc + d.consumidas, 0);
  const totalGastas = data.reduce((acc, d) => acc + d.gastas, 0);
  const diferenca = totalGastas - totalConsumidas;

  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto font-sans text-gray-800 p-4 sm:p-8">
      {/* 🔹 Cabeçalho */}
      <header className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Painel do <span className="text-[#F5BA45]">Consultor Inteligente</span>
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Acompanhe seu metabolismo e desempenho calórico semanal
        </p>
      </header>

      {/* 🔥 Resumo Inteligente */}
      <div className="bg-[#FFF9E6] p-6 rounded-2xl shadow-sm border border-yellow-200 text-center sm:text-left transition hover:shadow-md">
        {diferenca > 0 ? (
          <p className="text-gray-800 font-medium text-lg sm:text-xl">
            🔥 Nesta semana você gastou{" "}
            <span className="font-bold text-green-700">{diferenca} kcal</span>{" "}
            a mais do que consumiu. Excelente desempenho!
          </p>
        ) : (
          <p className="text-gray-800 font-medium text-lg sm:text-xl">
            ⚠️ Você consumiu{" "}
            <span className="font-bold text-red-600">
              {Math.abs(diferenca)} kcal
            </span>{" "}
            a mais do que gastou. Ajuste sua dieta ou treinos!
          </p>
        )}
      </div>

      {/* 🧮 Cálculo de TMB */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 space-y-4 hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
          ⚙️ Cálculo da TMB
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          Insira seus dados e descubra quantas calorias seu corpo precisa
          diariamente para manter suas funções vitais.
        </p>
        <TmbCalculation />
      </section>

      {/* 📊 Comparativo Calórico */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6 hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center sm:text-left">
          📊 Comparativo Calórico — Consumidas × Gastas
        </h2>
        <div className="w-full h-64 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="dia" tick={{ fill: "#4b5563" }} />
              <YAxis tick={{ fill: "#4b5563" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
              />
              <Legend />
              <Bar
                dataKey="consumidas"
                fill="#F5BA45"
                name="Calorias Consumidas"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="gastas"
                fill="#ef4444"
                name="Calorias Gastas"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
