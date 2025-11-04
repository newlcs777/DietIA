import { createSlice } from "@reduxjs/toolkit";

const dietSlice = createSlice({
  name: "diet",
  initialState: {
    dietText: "",
  },
  reducers: {
    setDietText: (state, action) => {
      state.dietText = action.payload;
    },
    clearDiet: (state) => {
      state.dietText = "";
    },
  },
});

export const { setDietText, clearDiet } = dietSlice.actions;
export default dietSlice.reducer;
