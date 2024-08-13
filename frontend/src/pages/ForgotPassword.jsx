import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, LucideMail, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmited(true);
  };

  return (
    <motion.div
      className="w-full max-w-md overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl backdrop-filter backdrop-blur-xl rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="p-8">
        <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text">
          Forgot Password
        </h2>

        {!isSubmited ? (
          <form onSubmit={handleSubmit}>
            <p className="mb-6 text-center text-gray-300">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
            <Input
              icon={Mail}
              type={"email"}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-3 font-bold text-white rounded-lg shadow-lg bg-gradient-to-r from-green-500 to bg-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {isLoading ? (
                <Loader className="mx-auto text-white size-6 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </motion.button>
          </form>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center justify-center mx-auto mb-4 bg-green-500 rounded-full size-16 "
            >
              <LucideMail className="text-white size-8" />
            </motion.div>
            <p className="mb-6 text-gray-300">
              If an account exists for {email} you will receive a link a
              password reset link shortly
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-center px-8 py-4 bg-gray-900 opacity-50">
        <Link
          to={"/signin"}
          className="flex items-center text-sm text-green-400 hover:underline"
        >
          <ArrowLeft className="mr-2 size-4" /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
