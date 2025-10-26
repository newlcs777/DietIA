import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Brain, Calculator, Activity, Info } from "lucide-react";

export default function TmbInfo() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 font-sans text-gray-800">
      <header className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          💡 Entenda sua <span className="text-[#F5BA45]">TMB</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          A <strong>Taxa Metabólica Basal (TMB)</strong> é a base de um plano
          inteligente. Saber sua TMB mostra quantas calorias seu corpo precisa
          apenas para manter as funções vitais.
        </p>
      </header>

      <section className="w-full bg-white p-6 rounded-2xl shadow-lg space-y-4 border border-gray-100">
        <div className="flex items-center gap-2">
          <Info className="w-6 h-6 text-[#F5BA45]" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Por que conhecer sua TMB?
          </h2>
        </div>
        <p className="text-gray-700">
          Saber sua TMB ajuda a ajustar a dieta e o treino para seus objetivos:
        </p>
        <ul className="space-y-2 text-gray-700">
          {["Manter o peso", "Ganhar massa muscular", "Perder gordura corporal"].map(
            (goal, i) => (
              <li key={i} className="flex items-center space-x-2">
                <FaCheckCircle className="text-[#F5BA45]" />
                <span>{goal}</span>
              </li>
            )
          )}
        </ul>
      </section>

      <section className="w-full bg-white p-6 rounded-2xl shadow-lg space-y-4 border border-gray-100">
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-[#F5BA45]" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Como é calculada a TMB
          </h2>
        </div>
        <p>
          A TMB é calculada considerando peso, altura, idade e sexo. Ela serve
          como base para definir o quanto seu corpo gasta e precisa por dia.
        </p>
      </section>

      <section className="w-full bg-white p-6 rounded-2xl shadow-lg space-y-4 border border-gray-100">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#F5BA45]" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Como usar a calculadora
          </h2>
        </div>
        <p>
          Insira seus dados e clique em{" "}
          <strong>Calcular e Salvar TMB</strong>. O resultado será gravado no
          seu perfil automaticamente e usado nas próximas etapas de avaliação.
        </p>
      </section>
    </div>
  );
}
