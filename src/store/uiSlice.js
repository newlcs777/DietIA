import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// 🔹 Buscar dados do Firestore
export const fetchUserData = createAsyncThunk("user/fetchUserData", async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return {};
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
});

// 🔹 Atualizar dados no Firestore
export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async (newData, { getState }) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Usuário não autenticado");

    const ref = doc(db, "users", uid);
    const currentData = getState().user.userData || {};
    const updated = { ...currentData, ...newData };

    await setDoc(ref, updated, { merge: true });
    return updated;
  }
);

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
        state.userData = action.payload;
      });
  },
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
