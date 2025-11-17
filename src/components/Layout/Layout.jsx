import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { usePageTracking } from "../../hooks/useAnalytics";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Obtener título de la página actual
  const getPageTitle = (pathname) => {
    const titles = {
      "/dashboard": "Dashboard",
      "/crear": "Crear Enlace",
      "/historial": "Historial",
      "/estadisticas": "Estadísticas",
      "/configuracion": "Configuración",
    };
    return titles[pathname] || "LinkShort";
  };

  // Tracking de página
  usePageTracking(getPageTitle(location.pathname));

  return (
    <div className="relative flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
