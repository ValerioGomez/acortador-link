import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Link, History, BarChart3, Settings, X } from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/crear", icon: Link, label: "Crear Enlace" },
    { path: "/historial", icon: History, label: "Historial" },
    { path: "/estadisticas", icon: BarChart3, label: "Estadísticas" },
    { path: "/configuracion", icon: Settings, label: "Configuración" },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"} 
      `}
      >
        {/* Logo y botón cerrar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              LinkShort
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

// ✅ AGREGAR EXPORT DEFAULT
export default Sidebar;
