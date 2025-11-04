import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUserData } from "../store/userSlice";
import { auth } from "../services/firebase";

// 🔹 Criação do contexto
const UserDataContext = createContext();

/**
 * Provedor global de dados do usuário
 * - Usa Redux para buscar e atualizar dados no Firestore
 * - Garante acesso em qualquer componente do app
 */
export function UserDataProvider({ children }) {
  const dispatch = useDispatch();
  const { userData, loading } = useSelector((state) => state.user);

  // 🔄 Busca automática ao montar
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) dispatch(fetchUserData());
  }, [dispatch]);

  // 🧠 Atualiza dados de exemplo (pode ser chamada em qualquer lugar)
  const handleUpdate = async (newData = { goal: "Hipertrofia" }) => {
    await dispatch(updateUserData(newData));
  };

  const value = { userData, loading, handleUpdate };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

/**
 * Hook customizado para consumir o contexto
 */
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData deve ser usado dentro de <UserDataProvider>");
  }
  return context;
};
