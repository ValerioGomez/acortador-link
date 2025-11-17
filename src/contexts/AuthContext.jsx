import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
        try {
          // Inicializar usuario sin bloquear si hay error
          await initializeUser(user.uid, user.email);

          // Intentar obtener datos del usuario, pero continuar aunque falle
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = {
              uid: user.uid,
              email: user.email,
              ...userDoc.data(),
            };
            setUser(userData);
          } catch (dbError) {
            console.warn(
              "Error obteniendo datos de usuario, usando datos básicos:",
              dbError
            );
            setUser({
              uid: user.uid,
              email: user.email,
              plan: "free",
            });
          }
        } catch (error) {
          console.warn(
            "Error en inicialización, continuando con datos básicos:",
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
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // Inicializar usuario sin bloquear si hay error
    try {
      await initializeUser(user.uid, user.email);
    } catch (error) {
      console.warn("Error inicializando usuario después de login:", error);
    }

    return {
      uid: user.uid,
      email: user.email,
      plan: "free",
    };
  };

  const register = async (email, password) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Inicializar usuario sin bloquear si hay error
    try {
      await initializeUser(user.uid, user.email);
    } catch (error) {
      console.warn("Error inicializando usuario después de registro:", error);
    }

    return {
      uid: user.uid,
      email: user.email,
      plan: "free",
    };
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
