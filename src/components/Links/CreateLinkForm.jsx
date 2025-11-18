import React, { useState } from "react";
import { Link2, Lock, MessageCircle } from "lucide-react";

const CreateLinkForm = ({ loading, onSubmit }) => {
  const initialFormState = {
    originalUrl: "",
    customSlug: "",
    password: "",
    hasPassword: false,
    customMessage: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, () => setFormData(initialFormState));
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* URL Original */}
      <div>
        <label
          htmlFor="originalUrl"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          URL Original *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            id="originalUrl"
            required
            value={formData.originalUrl}
            onChange={(e) => handleInputChange("originalUrl", e.target.value)}
            className="input-field pl-10"
            placeholder="https://ejemplo.com/pagina-muy-larga"
          />
        </div>
      </div>

      {/* Slug Personalizado */}
      <div>
        <label
          htmlFor="customSlug"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Slug Personalizado (Opcional)
        </label>
        <div className="flex rounded-lg shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 sm:text-sm">
            {window.location.hostname}/
          </span>
          <input
            type="text"
            id="customSlug"
            value={formData.customSlug}
            onChange={(e) => handleInputChange("customSlug", e.target.value)}
            className="input-field rounded-l-none"
            placeholder="mi-enlace-especial"
          />
        </div>
      </div>

      {/* Protección con Contraseña */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="hasPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Proteger con Contraseña
          </label>
          <button
            type="button"
            onClick={() =>
              handleInputChange("hasPassword", !formData.hasPassword)
            }
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              formData.hasPassword
                ? "bg-blue-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData.hasPassword ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {formData.hasPassword && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Contraseña *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  required={formData.hasPassword}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="input-field pl-10"
                  placeholder="Contraseña para proteger el enlace"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="customMessage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Mensaje Opcional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-3">
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="customMessage"
                  rows={3}
                  value={formData.customMessage}
                  onChange={(e) =>
                    handleInputChange("customMessage", e.target.value)
                  }
                  className="input-field pl-10 resize-none"
                  placeholder="Este mensaje se mostrará cuando pidan la contraseña."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botón Crear */}
      <div>
        <button
          type="submit"
          disabled={loading || !formData.originalUrl}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creando Enlace..." : "Crear Enlace Corto"}
        </button>
      </div>
    </form>
  );
};

export default CreateLinkForm;
