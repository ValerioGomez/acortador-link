import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Menu, Sun, Moon, User, LogOut, ChevronDown } from "lucide-react";

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between lg:justify-end px-4 py-3">
        {/* Botón menú móvil */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Controles derecho */}
        <div className="flex items-center space-x-4">
          {/* Toggle tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Menú usuario */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.displayName || user?.email}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </button>

            {/* Dropdown usuario */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.displayName || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Plan Free
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ✅ AGREGAR EXPORT DEFAULT
export default Header;
