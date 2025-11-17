import { useEffect } from "react";
import { analytics } from "../services/firebase";
import { logEvent } from "firebase/analytics";

export const useAnalytics = () => {
  const trackEvent = (eventName, eventParams = {}) => {
    if (analytics && import.meta.env.VITE_ENABLE_ANALYTICS === "true") {
      try {
        logEvent(analytics, eventName, eventParams);
      } catch (error) {
        console.warn("Error tracking event:", error);
      }
    }
  };

  const trackPageView = (pageTitle) => {
    trackEvent("page_view", {
      page_title: pageTitle,
      page_location: window.location.href,
    });
  };

  // Eventos específicos de la aplicación
  const trackLinkCreated = (linkData) => {
    trackEvent("link_created", {
      short_code: linkData.short_code,
      has_password: !!linkData.password,
    });
  };

  const trackLinkClicked = (linkData) => {
    trackEvent("link_clicked", {
      short_code: linkData.short_code,
      click_count: linkData.clicks,
    });
  };

  const trackUserRegistered = (userData) => {
    trackEvent("user_registered", {
      user_id: userData.uid,
      email: userData.email,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackLinkCreated,
    trackLinkClicked,
    trackUserRegistered,
  };
};

// Hook simplificado para tracking de páginas
export const usePageTracking = (pageTitle) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    if (pageTitle) {
      trackPageView(pageTitle);
    }
  }, [pageTitle, trackPageView]);
};
