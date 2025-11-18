import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { initializeUser } from "../services/databaseInit";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Intentar obtener datos del usuario, pero continuar aunque falle
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName, // Usar el displayName de Firebase Auth
            ...userDoc.data(),
          };
          setUser(userData);
        } catch (error) {
          console.error(
            "Error obteniendo datos de Firestore, usando datos de Auth:",
            error
          );
          setUser({
            uid: user.uid,
            email: user.email,
            plan: "free",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password, firstName, lastName) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const displayName = `${firstName} ${lastName}`.trim();

    // 1. Actualizar el perfil de Firebase Auth
    await updateProfile(user, { displayName });

    // 2. Crear el documento en Firestore
    try {
      await initializeUser(user, firstName, lastName);
    } catch (error) {
      console.warn("Error inicializando usuario después de registro:", error);
    }

    // Devolver el usuario con el perfil actualizado
    return user;
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
