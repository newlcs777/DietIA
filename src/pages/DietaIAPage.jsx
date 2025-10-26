import { useEffect, useState } from "react";

export default function DietaIAPage() {
  const [dieta, setDieta] = useState("");

  useEffect(() => {
    const dietaSalva = localStorage.getItem("dietaGerada");
    setDieta(dietaSalva || "Nenhum plano alimentar gerado ainda.");
  }, []);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-gray-800">
      <h1 className="text-2xl font-bold text-[#F5BA45] mb-4">🍽️ Dieta IA</h1>

      {dieta ? (
        <pre className="whitespace-pre-wrap leading-relaxed text-gray-700">
          {dieta}
        </pre>
      ) : (
        <p className="text-gray-500">
          Nenhum plano alimentar foi gerado ainda. Volte à página de resultado e
          clique em “Gerar Dieta”.
        </p>
      )}
    </div>
  );
}
