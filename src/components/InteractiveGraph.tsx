import React from "react";
import { motion } from "framer-motion";

const InteractiveGraph: React.FC = () => {
  const barCount = 12;
  const barVariants = {
    hidden: { height: 0 },
    visible: (i: number) => ({
      height: Math.random() * 100 + 20,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        type: "spring",
        stiffness: 300,
      },
    }),
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-primary">Activity Graph</h2>
        <div className="flex items-end justify-between h-40">
          {[...Array(barCount)].map((_, i) => (
            <motion.div
              key={i}
              className="w-4 bg-secondary rounded-t-md"
              variants={barVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              whileHover={{ scaleY: 1.1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractiveGraph;
