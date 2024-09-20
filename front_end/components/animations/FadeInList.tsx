import { motion } from 'framer-motion';

interface FadeInListProps {
  children: React.ReactNode[];
  className?:string
}

const FadeInList = ({ children,className =''}: FadeInListProps) => {
  return (
    <div className={ className!=""?className:" overflow-hidden flex w-full"}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.2, // Stagger effect
            duration: 0.6,
            ease: 'easeOut',
          }}
          style={{ top: `${index * 30}px` }} // Adjust spacing between items
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export default FadeInList;
