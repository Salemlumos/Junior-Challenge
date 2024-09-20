import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

type AnimatedButtonProps = {
  children: ReactNode;
};

export const AnimatedButton = ({ children }: AnimatedButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <motion.div
      onClick={handleClick}
      animate={{
        scale: isClicked ? 1.5 : 1, // Increase size on click
      }}
      whileHover={{ scale: 1.1 }} // Slight scale increase on hover
      transition={{
        type: 'spring', 
        stiffness: 300, 
        damping: 15,
      }}
      style={{ display: 'inline-block' }} // Ensures that scaling is applied correctly
    >
      {children}
    </motion.div>
  );
};

