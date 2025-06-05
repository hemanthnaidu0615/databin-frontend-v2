import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./FeatureCard.css";

interface FeatureCardProps {
  title: string;
  icon: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon, index }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && el) {
          el.classList.add("slide-in-up");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (el) {
      observer.observe(el);
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className="feature-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 * index,
        type: "spring",
        stiffness: 100,
        damping: 12,
      }}
    >
      <motion.i
        className={`${icon} text-[#a855f7] text-xl feature-icon`}
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{
          delay: 0.3 + index * 0.1,
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
      <span className="font-medium feature-title">{title}</span>
    </motion.div>
  );
};

export default FeatureCard;
