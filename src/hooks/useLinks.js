import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Timestamp } from "firebase/firestore";
import { createLink, getUserLinks, deleteLink } from "../services/links";

export const useLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const addLink = async (linkData) => {
    setLoading(true);
    try {
      const newLink = await createLink({
        ...linkData,
        userId: user.uid,
      });

      // Asegurarse de que el nuevo enlace tenga un timestamp compatible para ordenar
      const linkWithTimestamp = {
        ...newLink,
        created_at: Timestamp.fromDate(newLink.created_at),
      };

      setLinks((prev) => [linkWithTimestamp, ...prev]);
      // La lista ya está ordenada por `getUserLinks`, el nuevo se añade al principio.
      return newLink;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeLink = async (linkId) => {
    setLoading(true);
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

  useEffect(() => {
    const fetchLinks = async () => {
      if (!user) {
        setLinks([]);
        return;
      }
      setLoading(true);
      try {
        const userLinks = await getUserLinks(user.uid);
        setLinks(userLinks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [user]);

  return {
    links,
    loading,
    error,
    addLink,
    removeLink,
  };
};
