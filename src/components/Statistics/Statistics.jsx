import React from "react";
import { BarChart3, Eye, MousePointer, TrendingUp } from "lucide-react";

const Statistics = () => {
  // Datos de ejemplo - en producción vendrían de Firebase
  const statsData = {
    totalClicks: 1248,
    todayClicks: 45,
    popularLink: "linkshort.app/react",
    clickRate: "4.2%",
  };

  const chartData = [
    { date: "01 Ene", clicks: 45 },
    { date: "02 Ene", clicks: 67 },
    { date: "03 Ene", clicks: 23 },
    { date: "04 Ene", clicks: 89 },
    { date: "05 Ene", clicks: 34 },
    { date: "06 Ene", clicks: 56 },
    { date: "07 Ene", clicks: 78 },
  ];

  const topLinks = [
    {
      url: "linkshort.app/react",
      clicks: 234,
      original: "https://reactjs.org",
    },
    {
      url: "linkshort.app/firebase",
      clicks: 189,
      original: "https://firebase.google.com",
    },
    {
      url: "linkshort.app/tailwind",
      clicks: 156,
      original: "https://tailwindcss.com",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Estadísticas
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Analiza el rendimiento de tus enlaces
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Clicks Totales
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {statsData.totalClicks.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Clicks Hoy
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {statsData.todayClicks}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <MousePointer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tasa de Click
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {statsData.clickRate}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Enlace Popular
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {statsData.popularLink}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico y Top Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de actividad */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Actividad de Clicks (7 días)
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {chartData.map((day, index) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                    {day.date}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(day.clicks / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {day.clicks}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top enlaces */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Enlaces Más Populares
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topLinks.map((link, index) => (
                <div
                  key={link.url}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {link.url}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {link.original}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {link.clicks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
