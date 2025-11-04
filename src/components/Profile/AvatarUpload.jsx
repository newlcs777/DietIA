import { useState } from "react";
import { useDispatch } from "react-redux";
import { storage, db } from "../../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { updateUserData } from "../../store/userSlice";
import { motion } from "framer-motion";

export default function AvatarUpload({ userData }) {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userData?.uid) return;

    try {
      setUploading(true);

      // 🔹 Caminho no Storage
      const storageRef = ref(storage, `avatars/${userData.uid}.jpg`);
      await uploadBytes(storageRef, file);

      // 🔹 URL pública da imagem
      const photoURL = await getDownloadURL(storageRef);

      // 🔹 Atualiza no Firestore
      await updateDoc(doc(db, "users", userData.uid), { photoURL });

      // ✅ Atualiza no Redux (sem reload)
      dispatch(updateUserData({ ...userData, photoURL }));

      setUploading(false);
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      alert("❌ Ocorreu um erro ao enviar a foto.");
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
        {/* Input hidden */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="relative group"
        >
          <img
            src={
              userData?.photoURL ||
              "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
            }
            alt="Avatar"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#F5BA45] object-cover shadow-sm group-hover:shadow-md transition-all duration-300"
          />
          <span className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-all">
            Clique para alterar
          </span>
        </motion.div>

        {/* Botão */}
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
