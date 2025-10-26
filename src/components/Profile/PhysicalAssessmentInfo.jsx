import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import ExpandableText from "../ExpandableText";

export default function PhysicalAssessmentInfo() {
  const benefits = [
    {
      title: "Conhecer seu ponto de partida",
      description:
        "A avaliação mostra como está seu corpo, incluindo peso, percentual de gordura, massa muscular e condicionamento físico. Sem essas informações, fica difícil traçar objetivos claros e acompanhar o resultado.",
    },
    {
      title: "Definir metas realistas",
      description:
        "Com os resultados, é possível estabelecer metas atingíveis, como perder gordura, ganhar massa muscular ou melhorar resistência. Acompanhar os resultados aumenta a motivação e evita frustrações.",
    },
    {
      title: "Planejar treinos personalizados",
      description:
        "A avaliação ajuda a criar treinos específicos para o seu corpo e objetivo, tornando os exercícios mais eficientes. Evita perder tempo com treinos genéricos e acelera os resultados.",
    },
    {
      title: "Prevenir lesões",
      description:
        "Identifica desequilíbrios musculares, postura incorreta e limitações físicas. Permite ajustar os treinos e proteger músculos e articulações.",
    },
    {
      title: "Acompanhar a evolução",
      description:
        "Avaliações periódicas mostram se os treinos e a alimentação estão funcionando. Possibilita ajustes estratégicos e mantém a motivação ao ver os resultados reais.",
    },
    {
      title: "Melhorar a saúde geral",
      description:
        "Algumas avaliações incluem pressão arterial, frequência cardíaca e outros indicadores de saúde. Ajuda a adotar hábitos mais saudáveis e prevenir problemas futuros.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-white to-gray-50 py-10 px-4"
    >
      <div className="max-w-4xl mx-auto font-sans text-gray-800 space-y-10">
        {/* 🔹 Cabeçalho */}
        <header className="text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
          >
            Avaliação Física
          </motion.h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Entenda seu corpo e planeje treinos eficientes de forma inteligente
            e segura. Essa é a base do seu progresso!
          </p>
        </header>

        {/* 🔸 Conteúdo expansível */}
        <ExpandableText collapsedHeight={320}>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-5 shadow-[0_5px_25px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_35px_rgba(0,0,0,0.08)] flex items-start gap-3"
              >
                <FaCheckCircle className="text-[#F5BA45] text-2xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </ExpandableText>

        {/* 🔹 Conclusão */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-800 font-medium leading-relaxed px-4"
        >
          A avaliação física é <strong>o mapa do seu corpo</strong>: mostra onde
          você está, para onde pode ir e o caminho mais seguro para chegar lá.
          <br />
          <span className="text-[#F5BA45] font-semibold">
            Sem ela, qualquer treino ou dieta é apenas tentativa.
          </span>
        </motion.p>
      </div>
    </motion.div>
  );
}
