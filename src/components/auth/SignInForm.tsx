import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { axiosInstance } from "../../axios";
import "primeicons/primeicons.css";
import logo from "../../images/logo.png";

const features = [
  { title: "Custom Alerts & Thresholds", icon: "pi pi-bell" },
  { title: "Automated Alerting", icon: "pi pi-bolt" },
  { title: "Role-Based Views", icon: "pi pi-users" },
  { title: "Real-time Dashboard", icon: "pi pi-chart-bar" },
  { title: "Live Data Visualizations", icon: "pi pi-chart-line" },
  { title: "Performance Metrics Monitoring", icon: "pi pi-sliders-h" },
];

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post(
        "auth/login",
        { email, password },
        { withCredentials: true }
      );
      const role = data.role.identifier || "";
      const isAdmin = role.includes("admin") || role.includes("manager");

      navigate("/", { state: { user: data, showUserManagement: isAdmin } });
    } catch {
      setError("Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-tr from-[#f6edff] to-[#e9f0ff] dark:from-gray-900 dark:to-black transition-all duration-500">
      {/* Dark mode toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-md"
        >
          <i className={`pi ${darkMode ? "pi-sun" : "pi-moon"}`} />
        </button>
      </div>

      {/* Feature Panel */}
      <motion.div
        className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center space-y-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <img src={logo} alt="logo" className="h-10" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#9614d0] dark:text-white">
            Welcome to Databin
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-xl">
          Power your decisions with advanced alerting, live dashboards, and real-time metrics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-900 shadow-md border-l-4 border-[#9614d0] select-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, type: "spring", stiffness: 100, damping: 12 }}
            >
              <motion.i
                className={`${feature.icon} text-[#9614d0] text-xl`}
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  delay: 0.3 + idx * 0.1,
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              />
              <span className="text-gray-800 dark:text-white font-medium">
                {feature.title}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Login Panel */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#9614d0] dark:text-white">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-white">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9614d0]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-800 dark:text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9614d0]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`} />
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-[#9614d0] text-white rounded-md transition ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="text-center text-sm">
            <button
              className="text-gray-500 dark:text-gray-300 underline"
              onClick={() => navigate("/change-password")}
            >
              Forgot Password?
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signin;
