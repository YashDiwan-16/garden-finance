import React from "react";
import { motion } from "framer-motion";
import NebulaCard from "./NebulaCard";
import InteractiveGraph from "./InteractiveGraph";
import { FiUsers, FiActivity, FiTrendingUp } from "react-icons/fi";

const Content: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-5xl font-bold mb-8 text-center text-primary">
        Cosmic Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <NebulaCard
          title="Users"
          value="1,234,567"
          icon={<FiUsers size={24} />}
        />
        <NebulaCard
          title="Activity"
          value="89%"
          icon={<FiActivity size={24} />}
        />
        <NebulaCard
          title="Growth"
          value="+23.5%"
          icon={<FiTrendingUp size={24} />}
        />
      </div>
      <InteractiveGraph />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-primary mt-8 w-full"
      >
        Explore Cosmos
      </motion.button>
    </motion.div>
  );
};

export default Content;
