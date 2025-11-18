import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { nanoid } from "nanoid";

// Función para crear nuevo enlace
export const createLink = async (linkData) => {
  try {
    const {
      originalUrl,
      customSlug,
      password,
      userId,
      userEmail,
      customMessage,
    } = linkData;

    // Generar short_code único
    let shortCode = customSlug || nanoid(6);
    let attempts = 0;

    // Verificar que el short_code sea único
    while (attempts < 5) {
      const existingLink = await getLinkByShortCode(shortCode);

      if (!existingLink) {
        break; // short_code es único
      }

      shortCode = nanoid(6);
      attempts++;
    }

    // Crear short_url
    const shortUrl = `${window.location.origin}/l/${shortCode}`;

    // Crear documento del enlace
    const linkDoc = {
      original_url: originalUrl,
      short_code: shortCode,
      short_url: shortUrl,
      password: password ? await hashPassword(password) : null,
      custom_message: customMessage || null,
      created_at: serverTimestamp(),
      clicks: 0,
      owner_uid: userId,
      is_active: true,
      expiration_date: null,
      title: getUrlTitle(originalUrl),
    };

    const docRef = await addDoc(collection(db, "links"), linkDoc);

    return {
      id: docRef.id,
      ...linkDoc,
    };
  } catch (error) {
    console.error("Error creando enlace:", error);
    throw error;
  }
};

// Obtener enlaces del usuario (VERSIÓN TEMPORAL SIN ÍNDICE)
export const getUserLinks = async (userId, dateRange = {}) => {
  try {
    const { start, end } = dateRange;
    let queryConstraints = [where("owner_uid", "==", userId)];

    if (start) {
      queryConstraints.push(where("created_at", ">=", new Date(start)));
    }
    if (end) {
      // Añadimos un día para incluir todo el día de la fecha final
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() + 1);
      queryConstraints.push(where("created_at", "<", endDate));
    }

    const q = query(collection(db, "links"), ...queryConstraints);

    const querySnapshot = await getDocs(q);
    const links = [];

    querySnapshot.forEach((doc) => {
      links.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Ordenar manualmente en el cliente
    return links.sort((a, b) => {
      try {
        const dateA =
          a.created_at?.toDate?.() || new Date(a.created_at) || new Date(0);
        const dateB =
          b.created_at?.toDate?.() || new Date(b.created_at) || new Date(0);
        return dateB - dateA; // Orden descendente
      } catch (error) {
        return 0;
      }
    });
  } catch (error) {
    console.error("Error obteniendo enlaces:", error);
    // Si hay error, retornar array vacío
    return [];
  }
};

// Obtener enlace por short_code (VERSIÓN TEMPORAL)
export const getLinkByShortCode = async (shortCode) => {
  try {
    // Consulta simple sin índice compuesto
    const q = query(
      collection(db, "links"),
      where("short_code", "==", shortCode)
      // Temporalmente comentado: where('is_active', '==', true)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const linkData = doc.data();

    // Filtrar manualmente por is_active
    if (linkData.is_active === false) {
      return null;
    }

    return {
      id: doc.id,
      ...linkData,
    };
  } catch (error) {
    console.error("Error obteniendo enlace:", error);
    return null;
  }
};

// Incrementar contador de clicks
export const incrementClickCount = async (linkId) => {
  try {
    const linkRef = doc(db, "links", linkId);
    await updateDoc(linkRef, {
      clicks: increment(1),
    });
  } catch (error) {
    console.error("Error incrementando clicks:", error);
  }
};

// Registrar log de click
export const addClickLog = async (linkId, clickData) => {
  try {
    await addDoc(collection(db, "click_logs", linkId, "logs"), {
      ...clickData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error registrando click:", error);
  }
};

// Editar enlace
export const updateLink = async (linkId, updateData) => {
  try {
    const linkRef = doc(db, "links", linkId);
    await updateDoc(linkRef, updateData);
  } catch (error) {
    console.error("Error actualizando enlace:", error);
    throw error;
  }
};

// Eliminar enlace
export const deleteLink = async (linkId) => {
  try {
    await deleteDoc(doc(db, "links", linkId));
  } catch (error) {
    console.error("Error eliminando enlace:", error);
    throw error;
  }
};

// Función simple de hash
const hashPassword = async (password) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

// Verificar contraseña
export const verifyPassword = async (inputPassword, storedHash) => {
  try {
    const inputHash = await hashPassword(inputPassword);
    return inputHash === storedHash;
  } catch (error) {
    console.error("Error verificando password:", error);
    return false;
  }
};

// Función para extraer título de la URL
const getUrlTitle = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "").split(".")[0];
  } catch {
    return "Enlace";
  }
};
