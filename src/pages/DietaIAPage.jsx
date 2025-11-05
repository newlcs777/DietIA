import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { fetchUserData, updateUserData } from "../store/userSlice";

export default function DietaIAPage() {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.user);
  const dieta = userData?.dietaGerada || "";

  const [editingIndex, setEditingIndex] = useState(null);
  const [textoEditado, setTextoEditado] = useState("");

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const blocos = dieta
    ? dieta.split(/----------------------------/g).map((b) => b.trim())
    : [];

  const salvarAlteracao = () => {
    const novosBlocos = [...blocos];
    const titulo = novosBlocos[editingIndex].split("\n")[0];

    novosBlocos[editingIndex] = `${titulo}\n${textoEditado}`;

    dispatch(updateUserData({ dietaGerada: novosBlocos.join("\n\n----------------------------\n\n") }));

    setEditingIndex(null);
  };

  // ✅ PDF limpo (sem emojis, sem caracteres especiais)
  const downloadPdf = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.width - margin * 2;
    const lineH = 18;
    let y = 60;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Dieta Personalizada", margin, y);
    y += 30;

    blocos.forEach((b) => {
      const linhas = b.split("\n").filter((x) => x.trim() !== "");
      const titulo = linhas[0] || "";
      const conteudo = linhas.slice(1).join("\n");

      const tituloLimpo = titulo.replace(/[^\w\sÀ-ú]/gi, "");
      const conteudoLimpo = conteudo.replace(/[^\w\sÀ-ú.,:%()]/gi, "");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(245, 186, 69);
      doc.text(tituloLimpo, margin, y);
      y += 20;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      const textoDividido = doc.splitTextToSize(conteudoLimpo, pageWidth);
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

    doc.save("Dieta_Personalizada.pdf");
  };

  // 📄 Download TXT permanece igual
  const downloadTxt = () => {
    const blob = new Blob([dieta], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Dieta_Personalizada.txt";
    link.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 font-sans text-gray-800 space-y-10">

      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F5BA45]">
          Dieta Personalizada
        </h1>

        {dieta && (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={downloadTxt}
              className="bg-[#F5BA45] hover:bg-[#dca439] text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95"
            >
              📄 Baixar TXT
            </button>
            <button
              onClick={downloadPdf}
              className="bg-[#F5BA45] hover:bg-[#dca439] text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95"
            >
              🧾 Baixar PDF
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-600 py-10 animate-pulse">
          Carregando dieta...
        </div>
      ) : dieta ? (
        <div className="space-y-6">
          {blocos.map((b, i) => {
            const linhas = b.split("\n").filter((x) => x.trim() !== "");
            const titulo = linhas[0];
            const conteudo = linhas.slice(1).join("\n");

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-100 p-6 rounded-xl border border-gray-200 relative"
              >

                {editingIndex === i ? (
                  <>
                    <textarea
                      value={textoEditado}
                      onChange={(e) => setTextoEditado(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      rows={6}
                    />
                    <button
                      onClick={salvarAlteracao}
                      className="mt-3 bg-[#F5BA45] text-white px-4 py-2 rounded-lg"
                    >
                      ✅ Salvar alteração
                    </button>
                  </>
                ) : (
                  <>
                    {/* ✅ Ícone de lápis pequeno COM contorno e sem texto */}
                    <button
                      onClick={() => {
                        setEditingIndex(i);
                        setTextoEditado(conteudo);
                      }}
                      className="absolute top-3 right-3 p-1 rounded-md border border-gray-300 hover:bg-gray-200 active:scale-95 transition flex items-center justify-center"
                      style={{ width: "22px", height: "22px" }}
                    >
                      ✏️
                    </button>

                    <h2 className="text-xl sm:text-2xl font-semibold text-[#F5BA45] mb-3">
                      {titulo}
                    </h2>
                    <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {conteudo}
                    </p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center bg-yellow-50 p-6 rounded-xl border border-yellow-200">
          <p className="text-gray-700 text-base sm:text-lg font-medium">
            Nenhuma dieta gerada ainda.
          </p>
          <p className="text-gray-600 mt-2">
            Volte em
            <span className="font-semibold text-[#F5BA45]"> Resultado </span>
            e clique em <strong>"Gerar Dieta"</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
