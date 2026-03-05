"use client";

import { useEffect } from "react";

const DESKTOP_PARALLAX_SPEED = 0.45;
const MOBILE_PARALLAX_SPEED = 0.34;
const DESKTOP_MAX_OFFSET = 140;
const MOBILE_MAX_OFFSET = 72;
const DESKTOP_PARALLAX_SCALE = 1.14;
const MOBILE_PARALLAX_SCALE = 1.1;
const STICKY_DESKTOP_MAX_OFFSET = 44;
const STICKY_MOBILE_MAX_OFFSET = 20;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export default function ParallaxHeroController() {
  useEffect(() => {
    const parallaxRoots = Array.from(document.querySelectorAll<HTMLElement>(".parallax-hero"));
    const stickyRoots = Array.from(document.querySelectorAll<HTMLElement>(".scroll-hero"));
    if (!parallaxRoots.length && !stickyRoots.length) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let ticking = false;
    const activeSticky = new Set<HTMLElement>();

    const resetTransforms = () => {
      parallaxRoots.forEach((root) => {
        root.style.setProperty("--parallax-y", "0px");
        const layers = Array.from(root.querySelectorAll<HTMLElement>(".parallax-hero__image"));
        layers.forEach((layer) => {
          layer.style.transform = "translate3d(0, 0, 0) scale(1)";
        });
      });
      stickyRoots.forEach((root) => {
        root.style.setProperty("--scroll-parallax-y", "0px");
      });
    };

    const updateParallaxRoot = (root: HTMLElement) => {
      const rect = root.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const rootTop = rect.top + scrollY;
      const localScroll = scrollY - rootTop;
      const configuredSpeed = Number(root.dataset.parallaxSpeed);
      const configuredMax = Number(root.dataset.parallaxMax);
      const isMobile = window.innerWidth < 768;
      const fallbackSpeed = isMobile ? MOBILE_PARALLAX_SPEED : DESKTOP_PARALLAX_SPEED;
      const speed = Number.isFinite(configuredSpeed) ? configuredSpeed : fallbackSpeed;
      const fallbackMax = isMobile ? MOBILE_MAX_OFFSET : DESKTOP_MAX_OFFSET;
      const maxOffset = Number.isFinite(configuredMax) ? configuredMax : fallbackMax;
      const rawY = -localScroll * speed;
      const y = Math.max(-maxOffset, Math.min(maxOffset, rawY));

      const scale = isMobile ? MOBILE_PARALLAX_SCALE : DESKTOP_PARALLAX_SCALE;
      const layers = Array.from(root.querySelectorAll<HTMLElement>(".parallax-hero__image"));
      layers.forEach((layer) => {
        // Skip hidden responsive layers to avoid unnecessary style work.
        if (layer.getClientRects().length === 0) return;
        layer.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale})`;
      });

      root.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
    };

    const updateStickyRoot = (root: HTMLElement) => {
      const rect = root.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const progress = clamp01((viewportHeight - rect.top) / (viewportHeight + rect.height));
      const configuredMax = Number(root.dataset.stickyParallaxMax);
      const fallbackMax = window.innerWidth < 768 ? STICKY_MOBILE_MAX_OFFSET : STICKY_DESKTOP_MAX_OFFSET;
      const maxOffset = Number.isFinite(configuredMax) ? configuredMax : fallbackMax;
      const y = (progress * 2 - 1) * maxOffset;
      root.style.setProperty("--scroll-parallax-y", `${y.toFixed(2)}px`);
    };

    const tick = () => {
      ticking = false;
      if (reducedMotionQuery.matches) {
        resetTransforms();
        return;
      }
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      parallaxRoots.forEach((root) => {
        const rect = root.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= viewportHeight) return;
        updateParallaxRoot(root);
      });
      activeSticky.forEach(updateStickyRoot);
    };

    const requestTick = () => {
      if (ticking) return;
      ticking = true;
      frameId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const root = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            activeSticky.add(root);
            updateStickyRoot(root);
          } else {
            activeSticky.delete(root);
          }
        });
      },
      { threshold: [0, 1] }
    );

    stickyRoots.forEach((root) => observer.observe(root));

    const onScroll = () => requestTick();
    const onResize = () => {
      parallaxRoots.forEach(updateParallaxRoot);
      activeSticky.forEach(updateStickyRoot);
      requestTick();
    };
    const onReducedMotionChange = () => {
      if (reducedMotionQuery.matches) {
        resetTransforms();
      } else {
        parallaxRoots.forEach(updateParallaxRoot);
        activeSticky.forEach(updateStickyRoot);
        requestTick();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    if (!reducedMotionQuery.matches) {
      parallaxRoots.forEach(updateParallaxRoot);
      stickyRoots.forEach(updateStickyRoot);
    } else {
      resetTransforms();
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return null;
}
