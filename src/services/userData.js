// src/services/userData.js
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";

const db = getFirestore();

// 🔹 Busca os dados do usuário logado
export async function buscarDadosUsuario() {
  const user = auth.currentUser;
  if (!user) {
    console.warn("⚠️ Nenhum usuário autenticado.");
    return null;
  }

  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("✅ Dados do usuário encontrados:", docSnap.data());
      return docSnap.data();
    } else {
      console.warn("⚠️ Nenhum documento encontrado para este usuário.");
      return null;
    }
  } catch (error) {
    console.error("❌ Erro ao buscar dados do usuário:", error);
    return null;
  }
}

// 🔹 Salva ou atualiza dados do usuário (altura, peso, idade, sexo, etc)
export async function salvarDadosUsuario(dados) {
  const user = auth.currentUser;
  if (!user) {
    console.warn("⚠️ Nenhum usuário autenticado para salvar dados.");
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, dados, { merge: true }); // 🔥 merge = atualiza sem apagar o resto
    console.log("✅ Dados salvos com sucesso:", dados);
  } catch (error) {
    console.error("❌ Erro ao salvar dados do usuário:", error);
  }
}
