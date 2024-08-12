import { motion } from "framer-motion";
import Input from "../components/Input";
import { Mail, Lock, Loader } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Signin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuthStore();

  const handleSignIn = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md overflow-hidden bg-gray-800 bg-opacity-50 shadow-xl backdrop-filter backdrop-blur-xl rounded-2xl"
    >
      <div className="p-8">
        <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
          Sign In
        </h2>
        <form onSubmit={handleSignIn}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to={"/forgot-password"} 
          onClick={() => console.log("forgot password")}
          className="text-sm text-green-500 hover:underline">Forgot password?</Link>

          {error && <p className="mb-2 font-semibold text-red-500">{error}</p>}

          <motion.button
            className="w-full px-4 py-3 mt-5 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            type="submit"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="mx-auto size-6 animate-spin"/> : "Sign In"}
          </motion.button>
        </form>
      </div>
      <div className="flex justify-center px-8 py-4 bg-gray-900 bg-opacity-50">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-green-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default Signin