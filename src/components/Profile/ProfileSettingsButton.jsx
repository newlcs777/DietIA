import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

export default function ProfileSettingsButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/profile/settings")}
      className="flex items-center gap-2 bg-[#F5BA45] text-white px-4 py-2 rounded-xl
                 font-medium shadow-md hover:shadow-lg hover:bg-[#e4a834] 
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F5BA45]/50"
    >
      <Settings className="w-5 h-5" />
      <span>Configurações</span>
    </button>
  );
}
