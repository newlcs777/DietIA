import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import ExpandableText from "../ExpandableText";

export default function PhysicalAssessmentInfo() {
  const benefits = [
    {
      title: "Conhecer seu ponto de partida",
      description:
        "A avaliação mostra como está seu corpo — peso, percentual de gordura, massa muscular e condicionamento físico. Sem essas informações, fica difícil definir objetivos e acompanhar seu progresso real.",
    },
    {
      title: "Definir metas realistas",
      description:
        "Com os resultados em mãos, é possível estabelecer metas atingíveis — perder gordura, ganhar massa ou melhorar resistência. Isso evita frustrações e aumenta a motivação ao ver resultados concretos.",
    },
    {
      title: "Planejar treinos personalizados",
      description:
        "A avaliação permite criar treinos específicos para o seu corpo e objetivo, tornando os exercícios mais eficientes. Assim, você evita desperdiçar tempo com treinos genéricos.",
    },
    {
      title: "Prevenir lesões",
      description:
        "Detecta desequilíbrios musculares, postura incorreta e limitações físicas. Com isso, é possível ajustar o treino e proteger músculos e articulações contra sobrecarga.",
    },
    {
      title: "Acompanhar a evolução",
      description:
        "Comparando avaliações periódicas, você vê se os treinos e a alimentação estão funcionando. Isso permite ajustes precisos e mantém o foco em resultados reais.",
    },
    {
      title: "Melhorar a saúde geral",
      description:
        "Algumas avaliações incluem pressão arterial, frequência cardíaca e outros indicadores de saúde. Elas ajudam a adotar hábitos mais saudáveis e prevenir problemas futuros.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-white to-gray-50 py-10 px-4 font-sans"
    >
      <div className="max-w-4xl mx-auto text-gray-800 space-y-10">
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
            Entenda seu corpo e planeje seus treinos de forma inteligente e segura.
            A avaliação física é o primeiro passo para alcançar seus resultados!
          </p>
        </header>

        {/* 🔸 Lista de benefícios (expansível) */}
        <ExpandableText collapsedHeight={320}>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md 
                           flex items-start gap-3 transition-all duration-300"
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

        {/* 🔹 Mensagem final */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-800 font-medium leading-relaxed px-4"
        >
          A avaliação física é <strong>o mapa do seu corpo</strong> — mostra onde
          você está, para onde pode ir e o caminho mais seguro até lá.
          <br />
          <span className="text-[#F5BA45] font-semibold">
            Sem ela, qualquer treino ou dieta é apenas tentativa.
          </span>
        </motion.p>
      </div>
    </motion.div>
  );
}
