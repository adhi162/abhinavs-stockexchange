import { useEffect } from "react";

const animatedSelector = "[data-animate]";
const sectionSelector = "[data-animate-section]";

export const useScrollAnimations = () => {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const animatedElements = Array.from(
      document.querySelectorAll<HTMLElement>(animatedSelector)
    );

    if (!animatedElements.length) {
      return;
    }

    // Pre-set custom delays
    animatedElements.forEach((element) => {
      const delay = Number(element.dataset.animateDelay ?? "0");
      if (!Number.isNaN(delay)) {
        element.style.setProperty("--animate-delay", `${delay}ms`);
      }
    });

    const revealElement = (element: HTMLElement) => {
      element.setAttribute("data-visible", "true");
    };

    const revealSection = (section: HTMLElement) => {
      if (section.matches(animatedSelector)) {
        revealElement(section);
      }
      const sectionElements = Array.from(
        section.querySelectorAll<HTMLElement>(animatedSelector)
      );
      sectionElements.forEach(revealElement);
    };

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(sectionSelector)
    );

    const standaloneElements = animatedElements.filter(
      (element) => !element.closest(sectionSelector)
    );

    if (typeof IntersectionObserver === "undefined") {
      sections.forEach(revealSection);
      standaloneElements.forEach(revealElement);
      return;
    }

    const sectionObserver =
      sections.length > 0
        ? new IntersectionObserver(
            (entries, observer) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  revealSection(entry.target as HTMLElement);
                  observer.unobserve(entry.target);
                }
              });
            },
            {
              threshold: 0.15,
              rootMargin: "0px 0px -5% 0px"
            }
          )
        : null;

    const elementObserver =
      standaloneElements.length > 0
        ? new IntersectionObserver(
            (entries, observer) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  revealElement(entry.target as HTMLElement);
                  observer.unobserve(entry.target);
                }
              });
            },
            {
              threshold: 0.1,
              rootMargin: "0px 0px -5% 0px"
            }
          )
        : null;

    sections.forEach((section) => sectionObserver?.observe(section));
    standaloneElements.forEach((element) => elementObserver?.observe(element));

    return () => {
      sectionObserver?.disconnect();
      elementObserver?.disconnect();
    };
  }, []);
};

