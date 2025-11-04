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
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto px-4 py-8 font-sans text-gray-800">

      {/* Cabeçalho */}
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Painel do <span className="text-[#F5BA45]">Consultor Inteligente</span>
        </h1>
        <p className="text-gray-600 text-base">
          Acompanhe seu metabolismo e desempenho calórico semanal
        </p>
      </header>

      {/* Resumo Inteligente */}
      <div className="p-4 rounded-xl bg-[#FFF9E6] border border-yellow-200 text-center">
        {diferenca > 0 ? (
          <p className="text-gray-800 font-medium text-lg">
            🔥 Você gastou <span className="font-bold text-green-700">{diferenca} kcal</span> a mais do que consumiu.
          </p>
        ) : (
          <p className="text-gray-800 font-medium text-lg">
            ⚠️ Consumo maior que gasto:{" "}
            <span className="font-bold text-red-600">{Math.abs(diferenca)} kcal</span>
          </p>
        )}
      </div>

      {/* Calculadora TMB (sem camada extra) */}
      <TmbCalculation />

      {/* Comparativo Gráfico */}
      <section className="w-full h-72 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="consumidas" fill="#F5BA45" />
            <Bar dataKey="gastas" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
