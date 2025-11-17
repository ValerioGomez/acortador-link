import React, { useState, useEffect } from "react";
import { useLinks } from "../../hooks/useLinks";
import { Eye, Copy, Edit, Trash2, Link2, Search, Lock } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";
import Modal from "./Modal";

const LinkHistory = () => {
  const { links, loading, error, removeLink, editLink } = useLinks();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 10;

  // Estados para los modales
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [linkToEdit, setLinkToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    original_url: "",
    custom_slug: "",
  });

  // Filtrar enlaces basado en búsqueda
  const filteredLinks = links.filter(
    (link) =>
      link.original_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.short_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);
  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);

  const handleCopy = async (url) => {
    await navigator.clipboard.writeText(url);
    toast.success("Enlace copiado al portapapeles");
  };

  const handleDeleteConfirm = async () => {
    if (linkToDelete) {
      try {
        const promise = removeLink(linkToDelete.id);
        await toast.promise(promise, {
          loading: "Eliminando enlace...",
          success: "Enlace eliminado con éxito",
          error: (err) => err.message || "Error al eliminar el enlace",
        });
      } catch (error) {
        console.error("Fallo la eliminación:", error);
      } finally {
        setLinkToDelete(null);
      }
    }
  };

  const handleEditOpen = (link) => {
    setLinkToEdit(link);
    setEditFormData({
      original_url: link.original_url,
      custom_slug: link.short_code,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (linkToEdit) {
      try {
        const promise = editLink(linkToEdit.id, {
          original_url: editFormData.original_url,
          // No permitimos editar el slug por ahora para simplicidad
        });

        await toast.promise(promise, {
          loading: "Actualizando enlace...",
          success: "Enlace actualizado con éxito",
          error: (err) => err.message || "Error al actualizar el enlace",
        });
      } catch (error) {
        console.error("Fallo la edición:", error);
      } finally {
        setLinkToEdit(null);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("es-ES");
  };

  useEffect(() => {
    // Resetear página si los filtros cambian y la página actual queda fuera de rango
    if (currentPage > totalPages) setCurrentPage(Math.max(totalPages, 1));
  }, [searchTerm, links, currentPage, totalPages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Historial de Enlaces
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gestiona y revisa todos tus enlaces acortados
        </p>
      </div>

      {/* Barra de búsqueda y estadísticas */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar enlaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredLinks.length} enlaces encontrados
          </div>
        </div>
      </div>

      {/* Tabla de enlaces */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Enlace Corto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  URL Original
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentLinks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Link2 className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm
                          ? "No se encontraron enlaces"
                          : "No tienes enlaces creados"}
                      </p>
                      {!searchTerm && (
                        <p className="text-sm text-gray-400 mt-2">
                          Crea tu primer enlace desde el panel de creación
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentLinks.map((link) => (
                  <tr
                    key={link.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {link.short_url}
                        </span>
                        <button
                          onClick={() => handleCopy(link.short_url)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 dark:text-white truncate">
                          {link.original_url}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {link.clicks || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(link.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopy(link.short_url)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Copiar enlace corto"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditOpen(link)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          title="Editar URL original"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLinkToDelete(link)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-400">
                Mostrando {indexOfFirstLink + 1}-
                {Math.min(indexOfLastLink, filteredLinks.length)} de{" "}
                {filteredLinks.length} enlaces
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  Anterior
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LinkHistory;
