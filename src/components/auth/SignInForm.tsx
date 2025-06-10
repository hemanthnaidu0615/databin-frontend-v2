import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { axiosInstance } from "../../axios";
import "primeicons/primeicons.css";
import { Carousel } from "primereact/carousel";
import logo from "../../images/logo.png";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import FeatureCard from "./FeatureCard";

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
  const navigate = useNavigate();

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
      const userData = data as { role: { identifier: string } };
      const role = userData.role.identifier || "";
      const isAdmin = role.includes("admin") || role.includes("manager");

      navigate("/", { state: { user: userData, showUserManagement: isAdmin } });
    } catch {
      setError("Invalid credentials or invalid user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row  dark:to-[#2a2a2a] transition-all duration-500 text-gray-800 dark:text-gray-100">
      {/* Theme toggle button */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggleButton />
      </div>

      {/* Feature Panel */}
      <motion.div
        className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center space-y-10 dark:bg-gray-900 backdrop-blur-md"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <img src={logo} alt="logo" className="h-10" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#a855f7] dark:text-[#a855f7]">
            Welcome to Databin
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-xl">
          Power your decisions with advanced alerting, live dashboards, and
          real-time metrics.
        </p>

        {/* Desktop & Tablet - grid */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              index={idx}
              title={feature.title}
              icon={feature.icon}
            />
          ))}
        </div>

        {/* Mobile - carousel */}
        <div className="sm:hidden">
          <Carousel
            value={features}
            itemTemplate={(feature: { title: string; icon: string }) => {
              const idx = features.findIndex((f) => f.title === feature.title);
              return (
                <FeatureCard
                  key={idx}
                  index={idx}
                  title={feature.title}
                  icon={feature.icon}
                />
              );
            }}
            numVisible={1}
            numScroll={1}
            circular
            autoplayInterval={2000}
            showIndicators
            showNavigators={false}
          />
        </div>
      </motion.div>

      {/* Login Panel */}
      <motion.div
        className="w-full lg:w-1/2 lg:pl-40 p-6 sm:p-10 flex flex-col justify-center space-y-10 bg-white/80 dark:bg-gray-900 backdrop-blur-md"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-full max-w-md rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl
    bg-white/90 dark:bg-gray-900
    border border-white/20 dark:border-white/10 shadow-xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center text-[#a855f7] dark:text-[#a855f7]">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg text-sm bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/10
    text-white placeholder-white/50 backdrop-blur-md
    focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:scale-105 transition-transform duration-200"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg text-sm bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/10
    text-white placeholder-white/50 backdrop-blur-md
    focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:scale-105 transition-transform duration-200"
                />

                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`}
                  />
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`
    w-full py-2 px-4 text-white font-medium rounded-md
    bg-[#a855f7] transition duration-300 ease-in-out
    hover:scale-105 hover:shadow-lg active:scale-100 active:shadow-sm
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Signin;
