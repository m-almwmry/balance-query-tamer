
import { MotionProps } from 'framer-motion';

export const fadeIn = (delay: number = 0): MotionProps => {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      delay,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  };
};

export const slideUp = (delay: number = 0): MotionProps => {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: {
      delay,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  };
};

export const slideDown = (delay: number = 0): MotionProps => {
  return {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      delay,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  };
};

export const slideIn = (direction: 'left' | 'right', delay: number = 0): MotionProps => {
  return {
    initial: { 
      opacity: 0, 
      x: direction === 'left' ? -20 : 20 
    },
    animate: { 
      opacity: 1, 
      x: 0 
    },
    exit: { 
      opacity: 0, 
      x: direction === 'left' ? -20 : 20 
    },
    transition: {
      delay,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  };
};

export const scale = (delay: number = 0): MotionProps => {
  return {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      delay,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  };
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    }
  },
};
