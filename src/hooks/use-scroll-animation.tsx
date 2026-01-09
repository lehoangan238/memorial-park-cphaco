// Shared scroll animation variants for framer-motion
// Optimized for performance on mobile devices
// Uses GPU-accelerated properties (transform, opacity) only

import { useEffect, useState } from 'react';

const easeOut = [0.22, 1, 0.36, 1] as const;

// Hook to detect if user prefers reduced motion
export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// Hook to detect mobile device
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Viewport margin - smaller on mobile for earlier trigger
const getViewportMargin = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return "-50px";
  }
  return "-100px";
};

// Duration multiplier - faster on mobile
const getDuration = (baseDuration: number, isMobile = false) => {
  return isMobile ? baseDuration * 0.7 : baseDuration;
};

// ============ Basic Fade Animations (Mobile Optimized) ============

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: easeOut }
};

export const fadeInUpMobile = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.4, ease: easeOut }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: easeOut }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: easeOut }
};

export const fadeInLeftMobile = {
  initial: { opacity: 0, x: -15 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.4, ease: easeOut }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: easeOut }
};

export const fadeInRightMobile = {
  initial: { opacity: 0, x: 15 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 0.4, ease: easeOut }
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.4, ease: easeOut }
};

// ============ Scale Animations (GPU Optimized) ============

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.4, ease: easeOut }
};

export const scaleInSoft = {
  initial: { opacity: 0, scale: 0.98 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.35, ease: easeOut }
};

// ============ Stagger Containers (Optimized for Mobile) ============

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

export const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
};

export const staggerContainerSlow = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
};

// ============ Stagger Items (GPU Optimized) ============

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: easeOut }
  }
};

export const staggerItemMobile = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: easeOut }
  }
};

export const staggerItemLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: easeOut }
  }
};

export const staggerItemRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: easeOut }
  }
};

export const staggerItemScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: easeOut }
  }
};

// ============ Hero Animations ============

export const heroTitle = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easeOut }
};

export const heroSubtitle = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.15, ease: easeOut }
};

export const heroButton = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.3, ease: easeOut }
};

export const heroBackground = {
  initial: { scale: 1.05 },
  animate: { scale: 1 },
  transition: { duration: 1.2, ease: easeOut }
};

// ============ Line/Bar Animations ============

export const lineExpand = {
  initial: { scaleX: 0 },
  whileInView: { scaleX: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: easeOut }
};

export const lineExpandVertical = {
  initial: { scaleY: 0 },
  whileInView: { scaleY: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: easeOut }
};

// ============ Hover Animations (Desktop Only) ============
// These should be used with useIsMobile hook to disable on mobile

export const cardHover = {
  y: -6,
  transition: { duration: 0.25, ease: easeOut }
};

export const cardHoverScale = {
  scale: 1.02,
  transition: { duration: 0.25, ease: easeOut }
};

export const imageHover = {
  scale: 1.03,
  transition: { duration: 0.4, ease: easeOut }
};

export const buttonTap = {
  scale: 0.97
};

export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

// ============ Utility Functions ============

// Get responsive animation props based on screen size
export const getResponsiveAnimation = (desktop: object, mobile: object) => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return mobile;
  }
  return desktop;
};

// Reduced motion safe animation
export const getReducedMotionSafe = (animation: object, prefersReduced: boolean) => {
  if (prefersReduced) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true },
      transition: { duration: 0.2 }
    };
  }
  return animation;
};

// No animation variant for accessibility
export const noAnimation = {
  initial: {},
  whileInView: {},
  animate: {},
  viewport: { once: true },
  transition: { duration: 0 }
};
