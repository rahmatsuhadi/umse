'use client';

import { motion, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedWrapper({ children, className, delay = 0 }: AnimatedWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}