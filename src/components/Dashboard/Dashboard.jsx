import React from "react";
import { Link, Plus, BarChart3, Users, Eye } from "lucide-react";

const Dashboard = () => {
  // Datos de ejemplo - en producción vendrían de Firebase
  const stats = [
    { label: "Enlaces Totales", value: "24", icon: Link, color: "blue" },
    { label: "Clicks Totales", value: "1,248", icon: Eye, color: "green" },
    { label: "Enlaces Activos", value: "18", icon: BarChart3, color: "purple" },
    { label: "Tasa de Click", value: "4.2%", icon: Users, color: "orange" },
  ];

  const recentLinks = [
    {
      id: 1,
      shortUrl: "linkshort.app/abc123",
      originalUrl: "https://ejemplo.com/pagina-muy-larga",
      clicks: 45,
      date: "2024-01-15",
    },
    {
      id: 2,
      shortUrl: "linkshort.app/xzy789",
      originalUrl: "https://otro-ejemplo.com/articulo",
      clicks: 23,
      date: "2024-01-14",
    },
    {
      id: 3,
      shortUrl: "linkshort.app/def456",
      originalUrl: "https://tercer-ejemplo.com/producto",
      clicks: 67,
      date: "2024-01-13",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
    };
    return colors[color] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Resumen de tu actividad de enlaces
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nuevo Enlace</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 p-3 rounded-lg ${getColorClasses(
                  stat.color
                )} bg-opacity-10`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enlaces Recientes y Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enlaces Recientes */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Enlaces Recientes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {link.shortUrl}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {link.originalUrl}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {link.clicks}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        clicks
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="w-full btn-secondary">
                Ver Todos los Enlaces
              </button>
            </div>
          </div>
        </div>

        {/* Gráfico de Actividad */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Actividad Reciente
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Gráfico de actividad se mostrará aquí
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  (Integración con Recharts)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
