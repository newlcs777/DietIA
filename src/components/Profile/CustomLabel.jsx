import React from "react";

export default function CustomLabel({ title, text }) {
  return (
    <div className="flex flex-col items-start gap-1 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-gray-100 w-full transition-all hover:shadow-md hover:border-[#F5BA45]/60">
      {/* 🔹 Título (campo descritivo) */}
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </p>

      {/* 🔸 Valor ou texto exibido */}
      <label className="text-base sm:text-lg font-semibold text-gray-800">
        {text || "—"}
      </label>
    </div>
  );
}
