import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type ShakeOnHoverProps = {
  children: ReactNode;
};

const ShakeOnHover = ({ children }: ShakeOnHoverProps) => {
  return (
    <motion.div
      whileHover={{ x: [0, -10, 10, -10, 10, 0] }} // Shaking effect
      transition={{ duration: 0.5 }} // Duration of the shaking effect
    >
      {children}
    </motion.div>
  );
};

export default ShakeOnHover;
