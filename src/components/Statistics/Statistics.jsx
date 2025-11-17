import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserStats } from "../../services/stats";
import { getUserLinks } from "../../services/links";
import { BarChart3, Eye, MousePointer, TrendingUp, Link2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Statistics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalLinks: 0,
    averageClicks: 0,
  });
  const [topLinks, setTopLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const [userStats, userLinks] = await Promise.all([
          getUserStats(user.uid),
          getUserLinks(user.uid),
        ]);

        setStats(userStats);

        const sortedLinks = [...userLinks].sort(
          (a, b) => (b.clicks || 0) - (a.clicks || 0)
        );
        setTopLinks(sortedLinks.slice(0, 5)); // Tomamos los 5 más populares
      } catch (err) {
        setError("No se pudieron cargar las estadísticas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-12">{error}</div>;
  }

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
                {stats.totalClicks.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Link2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Enlaces Creados
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalLinks}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Clicks por Enlace
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.averageClicks}
              </p>
            </div>
          </div>
        </div>

        <a
          href={topLinks.length > 0 ? topLinks[0].short_url : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`card block p-6 transition-transform duration-200 ${
            topLinks.length > 0
              ? "hover:scale-105 cursor-pointer"
              : "pointer-events-none opacity-60"
          }`}
        >
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Enlace Popular
              </p>
              <p
                className="text-sm font-semibold text-gray-900 dark:text-white truncate"
                title={topLinks[0]?.short_url}
              >
                {topLinks.length > 0
                  ? topLinks[0].short_url.replace(/^https?:\/\//, "")
                  : "N/A"}
              </p>
            </div>
          </div>
        </a>
      </div>

      {/* Gráfico y Top Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de actividad */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Rendimiento de los Enlaces más Populares
            </h3>
          </div>
          <div className="p-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topLinks}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(128, 128, 128, 0.2)"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="short_code"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="clicks" fill="#2563eb" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
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
              {topLinks.length > 0 ? (
                topLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {link.short_url}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {link.original_url}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {link.clicks || 0}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-8">
                  Aún no hay datos de clicks para mostrar.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
