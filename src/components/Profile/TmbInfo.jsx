import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Brain, Calculator, Activity, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function TmbInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-10 font-sans text-gray-800"
    >
      {/* 🔹 Cabeçalho */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          💡 Entenda sua{" "}
          <span className="text-[#F5BA45] drop-shadow-sm">TMB</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          A <strong>Taxa Metabólica Basal (TMB)</strong> é o ponto de partida de
          qualquer plano inteligente. Ela indica quantas calorias seu corpo
          gasta apenas para manter as funções vitais — mesmo em repouso.
        </p>
      </header>

      {/* 🔸 Seção: Importância */}
      <motion.section
        whileHover={{ scale: 1.01 }}
        className="w-full bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-sm 
                   border border-gray-100 hover:shadow-md transition-all space-y-4"
      >
        <div className="flex items-center gap-2">
          <Info className="w-6 h-6 text-[#F5BA45]" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Por que conhecer sua TMB?
          </h2>
        </div>
        <p className="text-gray-700">
          Saber sua TMB ajuda a ajustar sua dieta e treino de acordo com seu
          objetivo:
        </p>
        <ul className="space-y-2 text-gray-700">
          {[
            "Manter o peso atual",
            "Ganhar massa muscular (hipertrofia)",
            "Reduzir gordura corporal (emagrecimento)",
          ].map((goal, i) => (
            <li key={i} className="flex items-center space-x-2">
              <FaCheckCircle className="text-[#F5BA45]" />
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* 🔸 Seção: Cálculo */}
      <motion.section
        whileHover={{ scale: 1.01 }}
        className="w-full bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-sm 
                   border border-gray-100 hover:shadow-md transition-all space-y-4"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-[#F5BA45]" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Como a TMB é calculada
          </h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          A fórmula leva em conta <strong>peso</strong>, <strong>altura</strong>,
          <strong> idade</strong> e <strong>sexo</strong>. Esses dados permitem
          estimar o gasto energético diário, servindo como base para ajustar
          calorias e macronutrientes de forma personalizada.
        </p>
      </motion.section>

      {/* 🔸 Seção: Uso prático */}
      <motion.section
        whileHover={{ scale: 1.01 }}
        className="w-full bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-sm 
                   border border-gray-100 hover:shadow-md transition-all space-y-4"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#F5BA45]" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Como usar a calculadora
          </h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Insira seus dados e clique em{" "}
          <strong>“Calcular e Salvar TMB”</strong>. O resultado será gravado no
          seu perfil e usado nas próximas etapas — como o cálculo de dieta
          inteligente e recomendações automáticas de treino.
        </p>
      </motion.section>
    </motion.div>
  );
}
