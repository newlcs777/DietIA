import { X } from "lucide-react";
import ChangePassword from "./ChangePassword";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountSettingsModal({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      >
        {/* 🔹 Container do modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100"
        >
          {/* 🔸 Cabeçalho */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              ⚙️ <span>Configurações da Conta</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-all"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* 🔹 Conteúdo interno */}
          <div className="space-y-6">
            <ChangePassword />

            {/* Placeholder para futuras seções */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center text-gray-500 text-sm">
              Em breve: mais opções de personalização de conta ✨
            </div>
          </div>

          {/* 🔸 Rodapé opcional */}
          <div className="text-center mt-6 text-xs text-gray-400">
            Consultor Inteligente © {new Date().getFullYear()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
