import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateLink from "./components/Links/CreateLink";
import LinkHistory from "./components/Links/LinkHistory";
import Statistics from "./components/Statistics/Statistics";
import Settings from "./components/Settings/Settings";
import RedirectHandler from "./components/Redirect/RedirectHandler";

// Componente para página no encontrada
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-xl font-medium text-gray-800 dark:text-gray-200 mt-4">
        Página no encontrada
      </p>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/" className="mt-6 btn-primary">
        Volver al Inicio
      </Link>
    </div>
  </div>
);

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Componente para rutas públicas (cuando ya está autenticado)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              className: "dark:bg-gray-700 dark:text-white",
              duration: 4000,
              success: {
                iconTheme: { primary: "#2563eb", secondary: "white" },
              },
            }}
          />
          <Routes>
            {/* Rutas públicas */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Ruta de redirección (pública) */}
            <Route path="/l/:shortCode" element={<RedirectHandler />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="crear" element={<CreateLink />} />
              <Route path="historial" element={<LinkHistory />} />
              <Route path="estadisticas" element={<Statistics />} />
              <Route path="configuracion" element={<Settings />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
