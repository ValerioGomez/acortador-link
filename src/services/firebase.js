import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Validar variables de entorno críticas
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  console.error("❌ Variables de entorno faltantes:", missingVars);
  throw new Error(
    "Configuración de Firebase incompleta. Verifica tu archivo .env"
  );
}

// Configuración 100% desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics condicional
let analytics = null;
if (
  typeof window !== "undefined" &&
  import.meta.env.VITE_ENABLE_ANALYTICS === "true"
) {
  analytics = getAnalytics(app);
}

// Log seguro (no muestra datos sensibles)
console.log("🔥 Firebase configurado correctamente");
console.log("📁 Project:", firebaseConfig.projectId);
console.log("🌐 Entorno:", import.meta.env.VITE_NODE_ENV);

export { analytics };
export default app;
