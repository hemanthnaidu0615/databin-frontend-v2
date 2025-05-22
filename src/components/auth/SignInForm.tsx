import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../axios";
import "primeicons/primeicons.css";

type UserData = {
  email: string;
  role: {
    identifier: string;
  };
};

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

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return setError("Email is required");
    if (!isValidEmail(email))
      return setError("Please enter a valid email address");
    if (!password) return setError("Password is required");

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post<UserData>(
        "auth/login",
        { email, password },
        { withCredentials: true }
      );
      const userData = response.data;

      const roleIdentifier = userData.role.identifier ?? "";
      const isAdminOrManager =
        roleIdentifier.includes("admin") || roleIdentifier.includes("manager");

      navigate("/", {
        state: { user: userData, showUserManagement: isAdminOrManager },
      });
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again later.");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-500 ease-in-out">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <i
            className={`pi ${darkMode ? "pi-sun" : "pi-moon"}`}
            style={{ fontSize: "1rem" }}
          ></i>
        </button>
      </div>

      {/* Login Card */}
      <div className="relative py-3 sm:max-w-sm sm:mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9614d0] to-[#9614d0] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20">
          <form onSubmit={handleSubmit}>
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

              {/* Email Input */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="mt-1 w-full bg-transparent border-b-2 border-gray-300 focus:outline-none h-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="relative mb-6">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="flex items-center border-b-2 border-gray-300">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="flex-1 h-10 bg-transparent focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-2 text-gray-500 dark:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"
                        }`}
                      style={{ fontSize: "1rem" }}
                    ></i>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#9614d0] text-white rounded-md px-4 py-2 w-full cursor-pointer ${loading ? "opacity-60" : ""
                  }`}
              >
                {loading ? "Logging in..." : "Submit"}
              </button>

              {/* Forgot Password */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-gray-500 dark:text-gray-300 cursor-pointer"
                  onClick={() => navigate("/change-password")}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Optional Signup Section */}
              {/* <div className="mt-4 text-center">
<p>
                  New user?
<button
                    type="button"
                    className="ml-2 border border-[#9614d0] px-4 py-2 rounded text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-[#9614d0] hover:text-white transition"
                    onClick={() => navigate('/signup')}
>
                    Sign up
</button>
</p>
</div> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
