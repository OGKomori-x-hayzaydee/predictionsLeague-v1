import { useReducedMotion } from 'framer-motion';

export default function usePrefersReducedMotion() {
  return Boolean(useReducedMotion());
}
