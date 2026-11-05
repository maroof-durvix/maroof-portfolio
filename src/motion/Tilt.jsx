import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { pointer, spring } from "./config.js";
import { useMotionPrefs } from "./useMotionPrefs.js";

/** Flat container wrapper with zero 3D tilt (keeps cards level and pristine). */
export default function Tilt({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
