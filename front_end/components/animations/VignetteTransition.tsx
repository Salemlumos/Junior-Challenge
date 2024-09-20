import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type VignetteTransitionProps = {
  children: ReactNode;
};

export const VignetteTransition = ({ children }: VignetteTransitionProps) => {
  return (
    <div className="relative z-0">
      {/* Vignette effect overlay */}
      <motion.div
        initial={{ opacity: 1 }} // Start fully visible
        animate={{ opacity: 0 }}  // Fade out to reveal the content
        transition={{
          duration: 1.5, // Adjust this value for the fade duration
          ease: 'easeInOut',
        }}
        className="absolute inset-0 z-50 bg-black vignette pointer-events-none" // Apply vignette effect with CSS
      />
      
      {/* Page Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};

