import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const SauronEye: React.FC = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);
  
  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: mouseX, clientY: mouseY } = event;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    x.set(mouseX - centerX);
    y.set(mouseY - centerY);
  };

  return (
    <div
      className="relative w-full h-full flex justify-center items-center"
      onMouseMove={handleMouseMove}
    >
    {/* saurons eye was removed duo lack of time to do the best fucking logo  */}
      <motion.img
        src="https://seeklogo.com/images/L/lord-of-the-rings-logo-CCAA419E2E-seeklogo.com.png"
        alt="Animated Image"
        width={300}
        height={300}
        style={{ 
          rotateX: rotateX,
          rotateY: rotateY,
        }}
      />
    </div>
  );
};

export default SauronEye;
