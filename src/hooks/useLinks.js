import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  createLink,
  getUserLinks,
  updateLink,
  deleteLink,
} from "../services/links";

export const useLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Cargar enlaces del usuario
  const loadLinks = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userLinks = await getUserLinks(user.uid);
      setLinks(userLinks);
    } catch (err) {
      setError(err.message);
      console.error("Error cargando enlaces:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo enlace
  const addLink = async (linkData) => {
    try {
      const newLink = await createLink({
        ...linkData,
        userId: user.uid,
        userEmail: user.email,
      });
      // Actualizar el estado localmente sin recargar todo
      setLinks((prev) => [newLink, ...prev]);
      return newLink;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Actualizar enlace
  const editLink = async (linkId, updateData) => {
    setLoading(true);
    setError(null);

    try {
      await updateLink(linkId, updateData);

      // Actualizar estado local
      setLinks((prev) =>
        prev.map((link) =>
          link.id === linkId ? { ...link, ...updateData } : link
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar enlace
  const removeLink = async (linkId) => {
    setLoading(true);
    setError(null);

    try {
      await deleteLink(linkId);
      setLinks((prev) => prev.filter((link) => link.id !== linkId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar enlaces al montar el hook
  useEffect(() => {
    loadLinks();
  }, [user]);

  return {
    links,
    loading,
    error,
    addLink,
    editLink,
    removeLink,
    refreshLinks: loadLinks,
  };
};
