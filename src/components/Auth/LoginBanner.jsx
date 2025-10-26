import { motion } from "framer-motion";

export default function LoginBanner() {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-lg sm:max-w-md text-center space-y-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-6 sm:p-8 mx-auto"
    >
      {/* 🖼️ Imagem do banner */}
      <motion.img
        src="/banner-performance.png"
        alt="Método Inteligente"
        className="rounded-2xl shadow-xl w-full object-cover hover:scale-[1.03] transition-transform duration-500"
        whileHover={{ scale: 1.03 }}
      />

      {/* 🧠 Texto de destaque */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-3"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
          Um método <span className="text-yellow-500">inteligente</span> de
          aumentar sua performance
        </h1>

        <p className="text-sm sm:text-base text-gray-700 max-w-sm mx-auto leading-relaxed">
          Planeje seus treinos e sua dieta com{" "}
          <span className="font-medium text-gray-900">tecnologia e propósito</span>.
          Resultados reais começam com um login 💪
        </p>
      </motion.div>
    </motion.div>
  );
}
