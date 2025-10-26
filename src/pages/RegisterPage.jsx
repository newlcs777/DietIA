import RegisterForm from "../components/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Criar Conta
        </h1>
        <RegisterForm />

        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem conta?{" "}
          <a
            href="/"
            className="text-yellow-600 hover:underline font-medium"
          >
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}
