import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// 🔹 Configuração do persist (usa localStorage)
const persistConfig = {
  key: "consultor-inteligente",
  storage,
  whitelist: ["user"], // apenas o slice user será salvo
};

// 🔹 Combina todos os reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// 🔹 Aplica persistência
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Cria a store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // evita warnings do redux-persist
    }),
});

// 🔹 Exporta o persistor
export const persistor = persistStore(store);
