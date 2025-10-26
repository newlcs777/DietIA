import React from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { motion } from "framer-motion";

export default function Disclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md border border-gray-100 
                 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] 
                 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] 
                 transition-all duration-300 p-6 sm:p-8 space-y-5"
    >
      {/* 🔸 Cabeçalho */}
      <div className="flex items-center space-x-3">
        <HiOutlineExclamationCircle className="w-7 h-7 text-[#F5BA45]" />
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          Atenção!
        </h3>
      </div>

      {/* 🔹 Texto introdutório */}
      <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
        Para gerar um plano alimentar <span className="font-semibold text-gray-900">personalizado</span>, 
        preencha corretamente as informações abaixo:
      </p>

      {/* 🔸 Lista de orientações */}
      <ul className="list-disc list-inside text-gray-700 space-y-2 pl-3 sm:pl-5">
        <li>
          Tipos de alimentos que você costuma consumir no dia a dia
        </li>
        <li>
          Frequência e tipos de treino realizados na academia
        </li>
        <li>
          Seu objetivo: perda de gordura, ganho de massa ou manutenção
        </li>
        <li>
          Suplementos que utiliza (caso utilize)
        </li>
      </ul>

      {/* 🔹 Conclusão */}
      <p className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed">
        Quanto mais <span className="text-[#F5BA45] font-semibold">precisas</span> forem as informações, 
        melhor será o resultado do seu plano alimentar inteligente.
      </p>
    </motion.div>
  );
}
