import ForgotPasswordForm from "../components/Auth/ForgotPasswordForm";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 font-sans text-gray-800 p-6 sm:p-10">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 w-full max-w-md transition-all hover:shadow-2xl">
        {/* 🔹 Cabeçalho */}
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Recuperar Senha
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Enviaremos um link para redefinir sua senha no e-mail cadastrado.
          </p>
        </div>

        {/* 🔸 Formulário */}
        <ForgotPasswordForm />

        {/* 🔸 Voltar para Login */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <a
            href="/"
            className="flex items-center gap-2 text-[#F5BA45] hover:text-yellow-600 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Login
          </a>
        </div>
      </div>
    </div>
  );
}
