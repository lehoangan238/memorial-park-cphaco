// Shared scroll animation variants for framer-motion
// Use these across all pages for consistent animations

const easeOut = [0.22, 1, 0.36, 1] as const;

// Basic fade animations
export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: easeOut }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: easeOut }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: easeOut }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: easeOut }
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: easeOut }
};

// Scale animations
export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: easeOut }
};

export const scaleInSoft = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5, ease: easeOut }
};

// Stagger container for children animations
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

export const staggerContainerSlow = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15
    }
  }
};

// Stagger item variants
export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easeOut }
  }
};

export const staggerItemLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: easeOut }
  }
};

export const staggerItemRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: easeOut }
  }
};

export const staggerItemScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: easeOut }
  }
};

// Hero animations
export const heroTitle = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: easeOut }
};

export const heroSubtitle = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 0.2, ease: easeOut }
};

export const heroButton = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 0.4, ease: easeOut }
};

export const heroBackground = {
  initial: { scale: 1.1 },
  animate: { scale: 1 },
  transition: { duration: 1.5, ease: easeOut }
};

// Line/bar animations
export const lineExpand = {
  initial: { scaleX: 0 },
  whileInView: { scaleX: 1 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: easeOut }
};

export const lineExpandVertical = {
  initial: { scaleY: 0 },
  whileInView: { scaleY: 1 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: easeOut }
};

// Parallax-like scroll effect
export const parallaxUp = {
  initial: { opacity: 0, y: 100 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.9, ease: easeOut }
};

// Card hover animations (use with whileHover)
export const cardHover = {
  y: -8,
  transition: { duration: 0.3, ease: easeOut }
};

export const cardHoverScale = {
  scale: 1.02,
  transition: { duration: 0.3, ease: easeOut }
};

// Image hover
export const imageHover = {
  scale: 1.05,
  transition: { duration: 0.5, ease: easeOut }
};

// Button animations
export const buttonTap = {
  scale: 0.95
};

export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

// Reveal from blur
export const revealFromBlur = {
  initial: { opacity: 0, filter: "blur(10px)" },
  whileInView: { opacity: 1, filter: "blur(0px)" },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: easeOut }
};

// Rotate in
export const rotateIn = {
  initial: { opacity: 0, rotate: -10 },
  whileInView: { opacity: 1, rotate: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: easeOut }
};
