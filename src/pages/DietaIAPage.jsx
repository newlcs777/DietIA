import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { fetchUserData } from "../store/userSlice";

export default function DietaIAPage() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.user);
  const dieta = userData?.dietaGerada || "";

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const blocos = dieta
    ? dieta.split(/----------------------------/g).map((b) => b.trim())
    : [];

  // 📄 Download TXT
  const downloadTxt = () => {
    const blob = new Blob([dieta], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Dieta_Gerada_IA.txt";
    link.click();
  };

  // 🧾 Download PDF
  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.width - margin * 2;
    const lineH = 18;
    let y = 60;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("🍽️ Dieta Gerada pela IA", margin, y);
    y += 30;

    blocos.forEach((b) => {
      const linhas = b.split("\n").filter((x) => x.trim() !== "");
      const titulo = linhas[0] || "";
      const conteudo = linhas.slice(1).join("\n");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(245, 186, 69);
      doc.text(titulo, margin, y);
      y += 20;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      const textoDividido = doc.splitTextToSize(conteudo, pageWidth);
      textoDividido.forEach((linha) => {
        if (y + lineH > doc.internal.pageSize.height - 40) {
          doc.addPage();
          y = 60;
        }
        doc.text(linha, margin, y);
        y += lineH;
      });
      y += 10;
    });

    doc.save("Dieta_Gerada_IA.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fffdfa] via-gray-50 to-gray-100 font-sans text-gray-800 py-6 px-3 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10 space-y-8"
      >
        {/* 🔹 Cabeçalho */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#F5BA45]">
          🍽️ Dieta Personalizada
        </h1>

        {/* 🧾 Botões de Download */}
        {dieta && (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={downloadTxt}
              className="bg-[#F5BA45] hover:bg-[#e2a93f] text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95"
            >
              📄 Baixar TXT
            </button>
            <button
              onClick={downloadPdf}
              className="bg-[#F5BA45] hover:bg-[#e2a93f] text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95"
            >
              🧾 Baixar PDF
            </button>
          </div>
        )}

        {/* 🔄 Estado de carregamento */}
        {loading ? (
          <div className="text-center text-gray-600 py-10 animate-pulse">
            Carregando dieta...
          </div>
        ) : dieta ? (
          // ✅ Dieta exibida
          <div className="space-y-6">
            {blocos.map((b, i) => {
              const linhas = b.split("\n").filter((x) => x.trim() !== "");
              const titulo = linhas[0] || "";
              const conteudo = linhas.slice(1).join("\n");

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner hover:shadow-md transition-all"
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
          // ⚠️ Sem dieta
          <div className="text-center bg-yellow-50 p-6 rounded-2xl border border-yellow-100 shadow-inner">
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              Nenhum plano alimentar foi gerado ainda.
            </p>
            <p className="text-gray-600 mt-2">
              Volte à página{" "}
              <span className="font-semibold text-gray-800">Resultado</span> e
              clique em{" "}
              <span className="text-[#F5BA45] font-semibold">“Gerar Dieta”</span>.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
