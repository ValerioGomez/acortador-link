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
  limit,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { nanoid } from "nanoid";

// Crear nuevo enlace
export const createLink = async (linkData) => {
  try {
    const { originalUrl, customSlug, password, userId } = linkData;

    // Generar short_code (slug)
    const shortCode = customSlug || nanoid(6);

    // Crear short_url (usaremos el dominio de tu app)
    const shortUrl = `${window.location.origin}/l/${shortCode}`;

    const linkDoc = {
      original_url: originalUrl,
      short_code: shortCode,
      short_url: shortUrl,
      password: password ? await hashPassword(password) : null,
      created_at: new Date(),
      clicks: 0,
      owner_uid: userId,
      is_active: true,
      expiration_date: null,
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

// Obtener enlaces del usuario
export const getUserLinks = async (userId) => {
  try {
    const q = query(
      collection(db, "links"),
      where("owner_uid", "==", userId),
      orderBy("created_at", "desc")
    );

    const querySnapshot = await getDocs(q);
    const links = [];

    querySnapshot.forEach((doc) => {
      links.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return links;
  } catch (error) {
    console.error("Error obteniendo enlaces:", error);
    throw error;
  }
};

// Obtener enlace por short_code para redirección
export const getLinkByShortCode = async (shortCode) => {
  try {
    const q = query(
      collection(db, "links"),
      where("short_code", "==", shortCode),
      where("is_active", "==", true)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error("Error obteniendo enlace:", error);
    throw error;
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
      timestamp: new Date(),
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

// Función simple de hash (en producción usa bcrypt)
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

// Verificar contraseña
export const verifyPassword = async (inputPassword, storedHash) => {
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
};
