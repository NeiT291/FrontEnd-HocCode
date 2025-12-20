import type { Transition } from "framer-motion";
export const pageVariants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -50,
  },
};

export const pageTransition: Transition = {
  duration: 0.35,
  ease: "easeInOut",
};