import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const user = JSON.parse(localStorage.getItem("user")) || {
    nome: "Usuário",
    role: "ADMIN"
  };

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>

      {/* BOTÃO USER */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 cursor-pointer"
      >
        {/* avatar */}
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-semibold text-purple-600">
          {user.nome?.charAt(0).toUpperCase()}
        </div>

        {/* info */}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-textPrimary">
            {user.nome}
          </span>
          <span className="text-xs text-textSecondary">
            {user.role}
          </span>
        </div>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden">

          <button
            onClick={() => navigate("/configuracoes")}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
          >
            ⚙️ Configurações
          </button>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-red-500"
          >
            🚪 Sair
          </button>

        </div>
      )}
    </div>
  );
}