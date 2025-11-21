import { useEffect } from "react";

const selector = "[data-animate]";

export const useScrollAnimations = () => {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

    if (!elements.length) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => {
        element.setAttribute("data-visible", "true");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
          } else {
            entry.target.removeAttribute("data-visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px"
      }
    );

    elements.forEach((element) => {
      const delay = Number(element.dataset.animateDelay ?? "0");
      if (!Number.isNaN(delay)) {
        element.style.setProperty("--animate-delay", `${delay}ms`);
      }
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);
};


