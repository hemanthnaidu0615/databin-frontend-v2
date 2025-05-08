import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';


interface LoginProps {
  setUser: (user: { id: number; role_id: number | null; role: string; token: string }) => void;
}

function Login({ setUser }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  

  

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return setError('Email is required');
    if (!isValidEmail(email)) return setError('Please enter a valid email address');
    if (!password) return setError('Password is required');

    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:8080/api/v1/auth/logout', {}, { withCredentials: true });
      // Send login request (sets HTTP-only cookie)
      await axios.post(
        'http://localhost:8080/api/v1/auth/login',
        { email, password },
        { withCredentials: true }
      );

      // Fetch user info using the cookie
      const res = await axios.get(`http://localhost:8080/api/v1/auth/me?ts=${Date.now()}`, {
        withCredentials: true,
      });
    
      const { id, role } = res.data;
    
      const user = {
        id,
        role_id: role?.id ?? null,
        role: role?.identifier ?? '',
        token: '',
      };
    
      setUser(user);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-sm sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9614d0] to-[#9614d0] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <form onSubmit={handleSubmit}>
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-semibold mb-4">Login</h1>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="mt-1 w-full border-b-2 border-gray-300 focus:outline-none h-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="flex items-center border-b-2 border-gray-300">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="flex-1 h-10 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`bg-[#9614d0] text-white rounded-md px-4 py-2 w-full cursor-pointer ${
                  loading ? 'opacity-60' : ''
                }`}
              >
                {loading ? 'Logging in...' : 'Submit'}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-gray-500 cursor-pointer"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="mt-4 text-center text-gray-900">
                <p>
                  New user?{' '}
                  <button
                    type="button"
                    className="border border-[#9614d0] px-4 py-2 rounded text-sm font-medium text-gray-700 cursor-pointer ml-2"
                    onClick={() => navigate('/signup')}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
