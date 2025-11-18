import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, AlertCircle, Link2, Loader } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Por favor completa todos los campos");
    }

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Error al iniciar sesión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl mx-auto overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        {/* Columna de Información */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 bg-slate-800 text-white">
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Link2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-bold leading-tight">SamSamLink</h2>
            </div>
            <p className="text-blue-200 text-lg">
              Acorta, gestiona y analiza tus enlaces con facilidad.
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-200">
              © {new Date().getFullYear()} SamSamLink. Todos los derechos
              reservados.
            </p>
            <p className="text-sm text-blue-200/70 mt-1">
              Desarrollado por{" "}
              <a
                href="https://valerio-gomez.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                Valerio Gomez
              </a>
            </p>
          </div>
        </div>

        {/* Columna de Login */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                <Lock className="text-blue-500 dark:text-blue-400 text-4xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Bienvenido de Vuelta
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Ingresa para continuar o{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  crea una cuenta
                </Link>
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 mb-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="relative mb-4">
              <Mail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-50 border border-gray-300 rounded-xl text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                required
                disabled={loading}
              />
            </div>

            <div className="relative mb-6">
              <Lock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-50 border border-gray-300 rounded-xl text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 flex items-center justify-center rounded-xl text-lg font-semibold text-white transition-all duration-300 transform bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed hover:scale-105 shadow-lg shadow-blue-500/30"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Iniciando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
