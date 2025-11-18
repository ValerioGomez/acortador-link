import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useLinks } from "../../hooks/useLinks";
import { useAnalytics } from "../../hooks/useAnalytics";
import Modal from "./Modal";
import toast from "react-hot-toast";
import CreateLinkForm from "./CreateLinkForm";

const CreateLink = () => {
  const [generatedLinkDetails, setGeneratedLinkDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  const { addLink, loading } = useLinks();
  const { trackLinkCreated } = useAnalytics();

  const handleSubmit = async (formData, clearForm) => {
    try {
      const newLink = await addLink(formData);
      trackLinkCreated(newLink);
      setGeneratedLinkDetails(newLink); // Guardar detalles para el modal
      clearForm(); // Limpiar el formulario
      toast.success("¡Enlace creado exitosamente!");
    } catch (error) {
      console.error("Error creando enlace:", error);
      toast.error("No se pudo crear el enlace.");
    }
  };

  const handleCopyInModal = async () => {
    if (!generatedLinkDetails) return;
    await navigator.clipboard.writeText(generatedLinkDetails.short_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Crear Nuevo Enlace
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Acorta tus enlaces y personalízalos según tus necesidades
        </p>
      </div>

      {/* Formulario */}
      <div className="card p-6">
        <CreateLinkForm loading={loading} onSubmit={handleSubmit} />
      </div>

      {/* Modal de Confirmación */}
      <Modal
        isOpen={!!generatedLinkDetails}
        onClose={() => setGeneratedLinkDetails(null)}
        title="¡Enlace Creado Exitosamente!"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              readOnly
              value={generatedLinkDetails?.short_url || ""}
              className="input-field flex-1 font-mono text-sm"
            />
            <button
              onClick={handleCopyInModal}
              className="btn-secondary flex items-center space-x-2 min-w-[100px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 break-all">
              <strong>URL Original:</strong>{" "}
              {generatedLinkDetails?.original_url}
            </p>
            {generatedLinkDetails?.password && (
              <>
                {generatedLinkDetails?.custom_message && (
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    <strong>Mensaje personalizado:</strong>{" "}
                    {generatedLinkDetails.custom_message}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateLink;
