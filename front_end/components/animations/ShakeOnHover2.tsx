import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type ShakeOnHoverProps = {
  children: ReactNode;
};

const ShakeOnHover2 = ({ children }: ShakeOnHoverProps) => {
  return (
    <motion.div
      whileHover={{ 
        x: [0, -5, 5, -5, 5, 0], // Slight horizontal shake
        y: [0, -3, 3, -3, 3, 0]  // Slight vertical shake
      }}
      transition={{ 
        duration: 0.4, // Duration of the shaking effect
        ease: "easeInOut" // Smooth easing for the animation
      }}
    >
      {children}
    </motion.div>
  );
};

export default ShakeOnHover2;
