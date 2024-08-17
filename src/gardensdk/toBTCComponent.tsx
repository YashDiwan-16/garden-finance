import { motion } from "framer-motion";
import TransactionsComponent from "./TransactionComponent";
import Balances from "./Balances";
import { useGardenSetup } from "./store";
import SwapComponent from "./SwapComponent";

const ToBTCComponent = () => {
  useGardenSetup();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md"
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Swap wBTC to BTC
        </h2>
        <p className="mt-2 text-center text-sm text-purple-200">
          via Ethereum Sepolia
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-8 w-full max-w-md"
      >
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-white">
              Account Balances
            </h3>
            <div className="mt-5">
              <Balances />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-8 w-full max-w-md"
      >
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <SwapComponent />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 w-full max-w-md"
      >
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">
              Recent Transactions
            </h3>
            <TransactionsComponent />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToBTCComponent;
