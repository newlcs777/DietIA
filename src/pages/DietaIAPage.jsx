import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

export default function DietaIAPage() {
  const [dieta, setDieta] = useState("");

  useEffect(() => {
    const dietaSalva = localStorage.getItem("dietaGerada");
    setDieta(dietaSalva || "");
  }, []);

  // Quebra o texto em blocos (título, infos e refeições)
  const blocos = dieta
    ? dieta.split(/----------------------------/g).map((bloco) => bloco.trim())
    : [];

  // 🔹 Download em TXT
  const handleDownloadTxt = () => {
    if (!dieta) return;
    const blob = new Blob([dieta], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Dieta_Gerada_IA.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 🔹 Download em PDF
  const handleDownloadPdf = () => {
    if (!dieta) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const lineHeight = 18;
    let y = 60;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("🍽️ Dieta Gerada pela IA", margin, y);
    y += 30;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Quebra cada bloco e escreve
    blocos.forEach((bloco, i) => {
      const linhas = bloco.split("\n").filter((l) => l.trim() !== "");
      const titulo = linhas[0] || "";
      const conteudo = linhas.slice(1).join("\n");

      // Título da refeição
      doc.setFont("helvetica", "bold");
      doc.setTextColor(245, 186, 69); // dourado
      doc.text(titulo, margin, y);
      y += 20;

      // Conteúdo
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      const textoDividido = doc.splitTextToSize(conteudo, pageWidth);
      textoDividido.forEach((linha) => {
        if (y + lineHeight > doc.internal.pageSize.height - 40) {
          doc.addPage();
          y = 60;
        }
        doc.text(linha, margin, y);
        y += lineHeight;
      });

      y += 10; // espaçamento entre blocos
    });

    doc.save("Dieta_Gerada_IA.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffdfa] via-gray-50 to-gray-100 font-sans text-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10 space-y-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#F5BA45] flex items-center justify-center gap-2">
          🍽️ Dieta Personalizada 
        </h1>

        {/* 🔽 Botões de Download */}
        {dieta && (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleDownloadTxt}
              className="bg-[#F5BA45] hover:bg-[#e2a93f] text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              📄 Baixar em TXT
            </button>
            <button
              onClick={handleDownloadPdf}
              className="bg-[#F5BA45] hover:bg-[#e2a93f] text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              🧾 Baixar em PDF
            </button>
          </div>
        )}

        {/* Exibição da dieta */}
        {dieta ? (
          <div className="space-y-6">
            {blocos.map((bloco, i) => {
              const linhas = bloco.split("\n").filter((l) => l.trim() !== "");
              const titulo = linhas[0] || "";
              const conteudo = linhas.slice(1).join("\n");

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner hover:shadow-md transition"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#F5BA45] mb-3">
                    {titulo}
                  </h2>
                  <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-base sm:text-lg">
                    {conteudo}
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center bg-yellow-50 p-6 rounded-2xl border border-yellow-100 shadow-inner">
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              Nenhum plano alimentar foi gerado ainda.
            </p>
            <p className="text-gray-600 mt-2">
              Volte à página de{" "}
              <span className="font-semibold">Resultado</span> e clique em{" "}
              <span className="text-[#F5BA45] font-semibold">
                “Gerar Dieta”
              </span>{" "}
              para criar sua dieta personalizada.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
