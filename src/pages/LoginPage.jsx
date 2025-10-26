import { motion } from "framer-motion";
import LoginForm from "../components/Auth/LoginForm";
import LoginBanner from "../components/Auth/LoginBanner";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 font-sans text-gray-800 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100"
      >
        {/* 🔹 Banner dourado (Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="hidden lg:flex flex-1 justify-center items-center p-10"
          style={{
            background: "linear-gradient(135deg, #F5BA45 0%, #E8A82E 100%)",
          }}
        >
          <LoginBanner />
        </motion.div>

        {/* 🔸 Formulário de Login */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-1 justify-center items-center bg-white p-8 sm:p-10"
        >
          <div className="w-full max-w-md space-y-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Bem-vindo de volta 👋
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Acesse sua conta do{" "}
              <span className="text-[#F5BA45] font-semibold">
                Consultor Inteligente
              </span>
              .
            </p>
            <LoginForm />
          </div>
        </motion.div>

        {/* 🔸 Banner (Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:hidden flex justify-center items-center p-6 mt-4 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #F5BA45 0%, #E8A82E 100%)",
          }}
        >
          <LoginBanner />
        </motion.div>
      </motion.div>
    </div>
  );
}
