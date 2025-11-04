import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext();

/**
 * Provedor de autenticação global
 * Gerencia o estado do usuário e integra com Firebase Auth.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Observa o estado de autenticação em tempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (err) => {
        console.error("Erro no AuthContext:", err);
        setError("Falha ao verificar autenticação.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔸 Logout seguro com tratamento de erro
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Erro ao sair:", err);
      setError("Não foi possível encerrar a sessão.");
    }
  }, []);

  const value = { user, loading, error, logout, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium">
          Carregando autenticação...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

/**
 * Hook customizado para acessar o contexto de autenticação.
 * @returns {{ user, loading, error, logout, isAuthenticated }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um <AuthProvider>");
  }
  return context;
}
