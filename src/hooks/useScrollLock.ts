import { useEffect } from "react";

export const useScrollLock = (enabled: boolean, containerId = "main-content") => {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (enabled) {
      container.classList.add("overflow-hidden");
      container.style.touchAction = "none";
    } else {
      container.classList.remove("overflow-hidden");
      container.style.touchAction = "";
    }

    return () => {
      container.classList.remove("overflow-hidden");
      container.style.touchAction = "";
    };
  }, [enabled, containerId]);
};