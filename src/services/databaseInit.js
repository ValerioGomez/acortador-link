import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Función para inicializar usuario automáticamente
export const initializeUser = async (userId, userEmail) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: userEmail,
        createdAt: new Date(),
        plan: "free",
        lastLogin: new Date(),
        totalLinks: 0,
        totalClicks: 0,
      });
      console.log("✅ Usuario inicializado en la base de datos");
    } else {
      console.log("✅ Usuario ya existe en la base de datos");
    }
  } catch (error) {
    console.error("❌ Error inicializando usuario:", error);
    // No lanzar el error, solo loguearlo para no bloquear la app
  }
};

// Función para crear estructura de ejemplo
export const createSampleData = async (userId) => {
  try {
    console.log("📝 Creando datos de ejemplo para usuario:", userId);
    // Por ahora vacío, implementar después
  } catch (error) {
    console.error("Error creando datos de ejemplo:", error);
  }
};
