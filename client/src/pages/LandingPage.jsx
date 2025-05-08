import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function LandingPage() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-2xl text-center bg-white p-10 rounded-3xl shadow-2xl">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-blue-700"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          🏏 Cricket Player Manager
        </motion.h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Manage your teams, players, and matches with ease.
        </p>
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition">
              Go to Dashboard
            </button>
          </Link>
          <Link to="/teams">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition">
              Manage Teams
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
