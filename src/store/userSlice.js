import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";


// ✅ Função para formatar nome a partir do email (retorna nome e sobrenome)
function formatDisplayName(value) {
  if (!value) return "";

  const cleaned = value
    .split("@")[0]            // pega antes do @
    .replace(/[0-9]/g, "")    // remove números
    .replace(/[._-]/g, " ")   // troca ., _, - por espaço
    .trim();

  const partes = cleaned.split(" ");

  const nome = partes[0];
  const sobrenome = partes[1] || "";    // pega só nome + sobrenome

  return `${nome} ${sobrenome}`.trim().replace(/\b\w/g, (l) => l.toUpperCase());
}


/* -------------------------------------------------------------------------- */
/* 🔹 Buscar dados salvos no Firebase Auth + Firestore                        */
/* -------------------------------------------------------------------------- */
export const fetchUserData = createAsyncThunk("user/fetchUserData", async () => {
  const authUser = auth.currentUser;
  if (!authUser) return {};

  const ref = doc(db, "users", authUser.uid);
  const snap = await getDoc(ref);

  const firestoreData = snap.exists() ? snap.data() : {};

  return {
    uid: authUser.uid,
    email: authUser.email,
    lastLogin: authUser.metadata?.lastSignInTime || firestoreData.lastLogin,
    displayName:
      firestoreData.displayName ||
      authUser.displayName ||
      formatDisplayName(authUser.email),  // ✅ usa formato correto
    ...firestoreData,
  };
});


/* -------------------------------------------------------------------------- */
/* 🔹 Atualizar no Firestore + Firebase Auth + Redux                          */
/* -------------------------------------------------------------------------- */
export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async (newData, { getState }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const uid = user.uid;
    const ref = doc(db, "users", uid);
    const current = getState().user.userData || {};

    // ✅ Se o usuário editou o nome, usa o do form, senão gera a partir do email
    const finalDisplayName = newData.displayName
      ? formatDisplayName(newData.displayName)
      : formatDisplayName(user.displayName || user.email);

   // ✅ Remove campos vazios/nulos para evitar apagar dados no Firestore
const cleanedData = Object.fromEntries(
  Object.entries(newData).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
);

const finalData = {
  ...current,
  ...cleanedData,        // ✅ agora só valores válidos
  email: user.email,
  displayName: finalDisplayName,
  lastLogin: new Date().toISOString(),
};


    // ✅ Salva no Firestore
    await setDoc(ref, finalData, { merge: true });

    // ✅ Atualiza no Firebase Auth
    await updateProfile(user, { displayName: finalDisplayName });

    return finalData; // ✅ volta atualizado para Redux
  }
);


/* -------------------------------------------------------------------------- */
/* 🔹 Slice do usuário                                                        */
/* -------------------------------------------------------------------------- */
const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearUserData: (state) => {
      state.userData = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.userData = action.payload;     // ✅Atualiza Redux
      });
  },
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
