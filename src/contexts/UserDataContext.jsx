import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  useEffect(() => {
    // Escuta login/logout
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);

        // Escuta em tempo real os dados do usuário
        const unsubscribeSnapshot = onSnapshot(ref, (snap) => {
          if (snap.exists()) {
            // userData vai conter tudo que já foi salvo:
            // height, weight, age, sex, goal, meals,
            // tmbResult, protein, carb, fat,
            // percentualGordura, resultado (soma dobras), etc.
            setUserData({ uid: user.uid, ...snap.data() });
          } else {
            // Usuário logado mas sem doc ainda
            setUserData({ uid: user.uid });
          }
          setLoadingUserData(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        // saiu do login
        setUserData(null);
        setLoadingUserData(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Atualiza/parcialmente o documento do usuário
  const updateUserData = async (newData) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    try {
      const ref = doc(db, "users", user.uid);
      await setDoc(
        ref,
        {
          ...newData,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      // Não precisa de setUserData manual,
      // o onSnapshot já vai atualizar userData em tempo real
    } catch (err) {
      console.error("❌ Erro ao atualizar dados do usuário:", err);
    }
  };

  return (
    <UserDataContext.Provider
      value={{
        userData,
        loadingUserData,
        updateUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
