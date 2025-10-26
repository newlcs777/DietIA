import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpandableText({ children, collapsedHeight = 300 }) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(collapsedHeight);
  const contentRef = useRef(null);

  // 🔹 Calcula a altura dinamicamente
  useEffect(() => {
    if (expanded) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(collapsedHeight);
    }
  }, [expanded, collapsedHeight]);

  return (
    <div className="relative transition-all duration-700 ease-in-out">
      {/* Conteúdo expansível com animação */}
      <motion.div
        ref={contentRef}
        animate={{ maxHeight: height }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>

      {/* Gradiente no final (efeito elegante de fade-out) */}
      {!expanded && (
        <div className="absolute bottom-10 left-0 w-full h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none rounded-b-2xl"></div>
      )}

      {/* Botão Ler mais / Mostrar menos */}
      <div className="flex justify-center mt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-gray-800 bg-[#F5BA45]/20 hover:bg-[#F5BA45]/30 transition-all duration-300 shadow-sm"
        >
          {expanded ? (
            <>
              Mostrar menos
              <ChevronUp className="w-4 h-4 text-[#F5BA45]" />
            </>
          ) : (
            <>
              Ler mais
              <ChevronDown className="w-4 h-4 text-[#F5BA45]" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
