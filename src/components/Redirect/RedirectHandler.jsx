import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLinkByShortCode,
  incrementClickCount,
  addClickLog,
  verifyPassword,
} from "../../services/links";
import { Shield, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [linkData, setLinkData] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const link = await getLinkByShortCode(shortCode);

        if (!link) {
          setError("El enlace que buscas no existe o ha sido eliminado.");
          setLoading(false);
          return;
        }

        setLinkData(link);

        if (link.password) {
          setPasswordRequired(true);
          setLoading(false);
          return;
        }

        await performRedirect(link);
      } catch (err) {
        setError("Error al procesar el enlace. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

  const performRedirect = async (link) => {
    try {
      await incrementClickCount(link.id);
      await addClickLog(link.id, {
        user_agent: navigator.userAgent,
        referrer: document.referrer,
      });
      window.location.href = link.original_url;
    } catch (err) {
      window.location.href = link.original_url;
    }
  };

  const handlePasswordSubmit = async (password) => {
    try {
      const isValid = await verifyPassword(password, linkData.password);
      if (isValid) {
        await performRedirect(linkData);
      } else {
        setError("Contraseña incorrecta. Verifica e intenta nuevamente.");
      }
    } catch (err) {
      setError("Error al verificar la contraseña.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando enlace seguro...
          </p>
        </div>
      </div>
    );
  }

  if (error && !passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Enlace No Disponible
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Tarjeta principal */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Contenido Protegido
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Este enlace está protegido con contraseña
              </p>
            </div>

            {/* Mensaje personalizado */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Para poder ingresar al contenido que guarda este enlace
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Introduce la contraseña proporcionada por el creador del
                    enlace.
                  </p>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <PasswordForm onSubmit={handlePasswordSubmit} error={error} />
          </div>

          {/* Footer informativo */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ¿Problemas para acceder? Contacta al creador del enlace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const PasswordForm = ({ onSubmit, error }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm text-center">
            {error}
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
        >
          Contraseña de acceso
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pr-12 text-center text-lg font-medium"
            placeholder="Ingresa la contraseña"
            required
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
      >
        <span>Acceder al Contenido</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

export default RedirectHandler;
