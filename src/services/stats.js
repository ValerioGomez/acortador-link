import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Obtener estadísticas generales del usuario
export const getUserStats = async (userId) => {
  try {
    const linksQuery = query(
      collection(db, "links"),
      where("owner_uid", "==", userId)
    );

    const linksSnapshot = await getDocs(linksQuery);

    let totalLinks = 0;
    let totalClicks = 0;
    let activeLinks = 0;

    linksSnapshot.forEach((doc) => {
      const data = doc.data();
      totalLinks++;
      totalClicks += data.clicks || 0;
      if (data.is_active) activeLinks++;
    });

    return {
      totalLinks,
      totalClicks,
      activeLinks,
      averageClicks: totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0,
    };
  } catch (error) {
    console.error("Error obteniendo stats:", error);
    throw error;
  }
};

// Obtener clicks por día para gráfico
export const getClicksOverTime = async (linkId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logsQuery = query(
      collection(db, "click_logs", linkId, "logs"),
      where("timestamp", ">=", startDate),
      orderBy("timestamp", "asc")
    );

    const snapshot = await getDocs(logsQuery);
    const clicksByDate = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.timestamp.toDate().toISOString().split("T")[0];

      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    // Convertir a array para el gráfico
    return Object.entries(clicksByDate).map(([date, count]) => ({
      date,
      clicks: count,
    }));
  } catch (error) {
    console.error("Error obteniendo clicks over time:", error);
    return [];
  }
};
