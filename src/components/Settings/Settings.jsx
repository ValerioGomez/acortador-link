import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { getUserLinks } from "../../services/links";
import { Moon, Sun, Bell, Shield, User, Globe } from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Función para formatear fechas para los inputs
  const formatDateForInput = (date) => {
    if (!date) return "";
    // Maneja tanto Timestamps de Firebase como objetos Date de JS
    const d = date.toDate ? date.toDate() : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Establecer fechas predeterminadas al cargar el usuario
  useEffect(() => {
    if (user?.createdAt) {
      setDateRange({
        start: formatDateForInput(user.createdAt),
        end: formatDateForInput(new Date()),
      });
    }
  }, [user]);

  // Sanitiza una celda para prevenir CSV Injection
  const sanitizeCell = (cell) => {
    let sanitized = String(cell).replace(/"/g, '""'); // Escapar comillas dobles
    if (["=", "+", "-", "@"].includes(sanitized.charAt(0))) {
      sanitized = "'" + sanitized; // Preceder con una comilla simple
    }
    return `"${sanitized}"`;
  };

  const handleExportCSV = async () => {
    if (!user) return;

    setExporting(true);
    const toastId = toast.loading("Exportando enlaces...");

    try {
      const linksToExport = await getUserLinks(user.uid, dateRange);

      if (linksToExport.length === 0) {
        toast.error(
          "No hay enlaces para exportar en el período seleccionado.",
          { id: toastId }
        );
        return;
      }

      // Construir el encabezado del reporte
      const reportHeader = [
        `REPORTE DE ${user.displayName || user.email}`,
        `PERIODO: ${dateRange.start || "Inicio"} a ${dateRange.end || "Fin"}`,
        `USUARIO: ${user.displayName} (${user.email})`,
        "", // Línea en blanco para separar
      ].join("\n");

      const headers = [
        "Enlace Corto",
        "URL Original",
        "Clicks",
        "Fecha de Creación",
      ];
      const rows = linksToExport.map((link) => [
        `"${link.short_url}"`,
        `"${link.original_url}"`,
        link.clicks || 0,
        link.created_at
          ? new Date(link.created_at.seconds * 1000).toISOString()
          : "N/A",
      ]);

      let csvContent =
        "data:text/csv;charset=utf-8," +
        reportHeader +
        "\n" +
        headers.join(",") +
        "\n" +
        rows.join("\n");

      const encodedUri = encodeURI(csvContent);
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", encodedUri);
      linkElement.setAttribute(
        "download",
        `enlaces_${dateRange.start}_a_${dateRange.end}.csv`
      );
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);

      toast.success("Exportación completada.", { id: toastId });
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("No se pudo completar la exportación.", { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuración
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Personaliza tu experiencia en LinkShort
        </p>
      </div>

      {/* Preferencias de Tema */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            {isDark ? (
              <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Apariencia
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personaliza el tema de la aplicación
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Modo Oscuro
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isDark ? "Tema oscuro activado" : "Tema claro activado"}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDark ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isDark ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preferencias de Notificaciones */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Notificaciones
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configura cómo recibir notificaciones
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Notificaciones por email
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recibe resúmenes semanales de actividad
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Información de la Cuenta */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Cuenta
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Información de tu cuenta y plan
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="font-medium text-gray-900 dark:text-white">
              Plan Actual
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Free
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "65%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              13 de 20 enlaces utilizados este mes
            </p>
          </div>
        </div>
      </div>

      {/* Configuración de Privacidad */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Privacidad
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configuración de privacidad y datos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="font-medium text-gray-900 dark:text-white">
              Exportar Datos
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Descarga tus enlaces en formato CSV. Puedes filtrar por un rango
              de fechas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="start-date"
                  className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                >
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  name="start"
                  id="start-date"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  className="input-field"
                />
              </div>
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                >
                  Fecha de fin
                </label>
                <input
                  type="date"
                  name="end"
                  id="end-date"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  className="input-field"
                />
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="btn-secondary text-sm w-full sm:w-auto"
            >
              {exporting ? "Exportando..." : "Exportar a CSV"}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Si no seleccionas fechas, se exportarán todos tus enlaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
