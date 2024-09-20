import React from "react";
import { motion } from "framer-motion";

type SpinningFadeInProps = {
  children: React.ReactNode;
  className?:string;
};

export const SpinningFadeIn: React.FC<SpinningFadeInProps> = ({ children,className='' }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotate: 0, scale: 0.8 }}  // Starts faded out and spinning
      animate={{ opacity: 1, rotate: 360, scale: 1 }}  // Ends with fade in and spin
      transition={{
        duration: 1.5, // Length of animation
        ease: "easeInOut",
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {children} {/* Apply the effect to the children passed in */}
    </motion.div>
  );
};

