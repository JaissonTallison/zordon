import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";

export default function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  // sincroniza com sidebar
  useEffect(() => {
    const interval = setInterval(() => {
      setCollapsed(localStorage.getItem("sidebar-collapsed") === "true");
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zordon-light min-h-screen">
      <Sidebar />

      <main
        className={`
          min-h-screen p-6 transition-all duration-300

          ${collapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        {children}
      </main>
    </div>
  );
}