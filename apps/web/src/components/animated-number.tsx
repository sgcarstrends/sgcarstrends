"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface Props {
  value: number;
  from?: number;
}

export const AnimatedNumber = ({ value, from = 0 }: Props) => {
  const spring = useSpring(from, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString(),
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span
      key={value}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {display}
    </motion.span>
  );
};
