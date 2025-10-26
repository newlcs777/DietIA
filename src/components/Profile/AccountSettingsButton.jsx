import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

export default function AccountSettingsButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/profile/settings")}
      title="Configurações da Conta"
      className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm 
                 hover:shadow-md hover:bg-gray-50 active:scale-95 transition-all duration-200"
    >
      <Settings className="w-5 h-5 text-gray-600 group-hover:text-[#F5BA45] transition-colors duration-200" />
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 hidden sm:inline">
        Configurações
      </span>
    </button>
  );
}
