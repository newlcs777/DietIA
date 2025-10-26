import { useState } from "react";
import { auth, storage, db } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";

export default function AvatarUpload() {
  const [uploading, setUploading] = useState(false);
  const user = auth.currentUser;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      // 🔹 Caminho no Storage
      const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(storageRef, file);

      // 🔹 URL pública
      const photoURL = await getDownloadURL(storageRef);

      // 🔹 Atualiza Auth e Firestore
      await updateDoc(doc(db, "users", user.uid), { photoURL });
      await user.updateProfile({ photoURL });

      alert("✅ Foto atualizada com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      alert("❌ Ocorreu um erro ao enviar a foto. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center space-y-3"
    >
      <label className="cursor-pointer flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 🟡 Avatar com efeito de foco */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="relative group"
        >
          <img
            src={
              user?.photoURL ||
              "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
            }
            alt="Avatar"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#F5BA45] object-cover shadow-sm group-hover:shadow-md transition-all duration-300"
          />
          <span className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-all">
            Clique para alterar
          </span>
        </motion.div>

        {/* 🟢 Botão de ação */}
        <button
          disabled={uploading}
          className={`mt-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#F5BA45] hover:bg-[#e4a834] hover:shadow-md active:scale-95"
          }`}
        >
          {uploading ? "Enviando..." : "Alterar Foto"}
        </button>
      </label>
    </motion.div>
  );
}
