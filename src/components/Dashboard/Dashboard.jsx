import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getUserStats, getClicksOverTime } from "../../services/stats";
import { getUserLinks } from "../../services/links";
import {
  Link as LinkIcon,
  Plus,
  BarChart3,
  Eye,
  TrendingUp,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentLinks, setRecentLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const [userStats, userLinks] = await Promise.all([
          getUserStats(user.uid),
          getUserLinks(user.uid),
        ]);

        setStats(userStats);
        setRecentLinks(userLinks.slice(0, 3)); // Tomamos los 3 más recientes

        // Encontrar el enlace más popular y obtener sus datos para el gráfico
        if (userLinks.length > 0) {
          const topLink = [...userLinks].sort(
            (a, b) => (b.clicks || 0) - (a.clicks || 0)
          )[0];
          if (topLink && topLink.clicks > 0) {
            const clicksData = await getClicksOverTime(topLink.id, 15); // Clicks de los últimos 15 días
            setChartData(clicksData);
          }
        }
      } catch (err) {
        setError("No se pudo cargar la información del dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const statCards = stats
    ? [
        {
          label: "Enlaces Totales",
          value: stats.totalLinks,
          icon: LinkIcon,
          color: "blue",
        },
        {
          label: "Clicks Totales",
          value: stats.totalClicks.toLocaleString(),
          icon: Eye,
          color: "green",
        },
        {
          label: "Enlaces Activos",
          value: stats.activeLinks,
          icon: BarChart3,
          color: "purple",
        },
        {
          label: "Clicks / Enlace",
          value: stats.averageClicks,
          icon: TrendingUp,
          color: "orange",
        },
      ]
    : [];

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
    <div className="space-y-6 p-6">
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
          <button
            onClick={() => navigate("/crear")}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Enlace</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}
              >
                <stat.icon
                  className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                />
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
              {recentLinks.length > 0 ? (
                recentLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {link.short_url}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {link.original_url}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {link.clicks || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          clicks
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-8">
                  No hay enlaces recientes para mostrar.
                </p>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate("/historial")}
                className="w-full btn-secondary"
              >
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
          {chartData.length > 0 ? (
            <div className="p-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorClicks"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <LineChartIcon className="w-12 h-12 mx-auto mb-4" />
                <p>No hay suficiente actividad para mostrar un gráfico.</p>
                <p className="text-sm mt-1">
                  ¡Comparte tus enlaces para ver los resultados!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
