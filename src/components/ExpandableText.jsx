import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ExpandableText({ children, collapsedHeight = 300 }) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(collapsedHeight);
  const contentRef = useRef(null);

  // 🔹 Atualiza altura dinamicamente com base no estado
  useEffect(() => {
    if (expanded) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(collapsedHeight);
    }
  }, [expanded, collapsedHeight]);

  return (
    <div className="relative transition-all duration-700 ease-in-out">
      {/* 🔸 Conteúdo expansível com animação suave */}
      <motion.div
        ref={contentRef}
        animate={{ maxHeight: height }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>

      {/* 🔹 Efeito de fade elegante no final do texto */}
      {!expanded && (
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none rounded-b-2xl" />
      )}

      {/* 🔘 Botão de alternância */}
      <div className="flex justify-center mt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm sm:text-base font-semibold 
                     text-gray-800 bg-[#F5BA45]/20 hover:bg-[#F5BA45]/30 
                     transition-all duration-300 shadow-sm backdrop-blur-sm"
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
