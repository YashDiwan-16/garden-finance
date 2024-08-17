import React from "react";
import { motion } from "framer-motion";

interface NebulaCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const NebulaCard: React.FC<NebulaCardProps> = ({ title, value, icon }) => {
  return (
    <motion.div
      className="card bg-base-100 shadow-xl"
      whileHover={{ scale: 1.05, rotateY: 15 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="card-body">
        <h2 className="card-title text-primary">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
        <div className="card-actions justify-end">{icon}</div>
      </div>
    </motion.div>
  );
};

export default NebulaCard;
