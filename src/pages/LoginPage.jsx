import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import darkBg from '../assets/images/DarkBG.png';
import lightBg from '../assets/images/LightBG.png';
import Navbar from "../components/common/Navbar";
import { ThemeContext } from '../context/ThemeContext';

export default function LoginPage() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const bg = isDark ? darkBg : lightBg;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Navbar variant="auth" />
      <div
        className="h-[calc(100vh-64px)] w-full flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white/90 shadow-2xl backdrop-blur-xl overflow-hidden dark:border-gray-700/80 dark:bg-gray-900/90">
          <div className="relative flex items-center justify-center px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => navigate('/')}
              className="absolute left-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 dark:text-white">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Login</h2>
          </div>

          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Login to your account!</p>

            <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white font-semibold text-sm transition hover:opacity-90"
                style={{ backgroundColor: '#FF385C' }}
              >
                Continue
              </button>
            </form>

            <div className="my-5 border-t border-gray-200 dark:border-gray-700" />

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                {/* Google SVG – unchanged */}
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41 34.8 44 29.9 44 24c0-1.3-.1-2.3-.4-3.5z" />
                </svg>
                Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                {/* GitHub SVG – unchanged */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1e272e">
                  <path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 22.3 24 17.8 24 12.5 24 5.9 18.6.5 12 .5z" />
                </svg>
                Continue with Github
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-5">
              First time using Airbnb?{' '}
              <button onClick={() => navigate('/signup')} className="font-semibold text-gray-900 dark:text-white hover:underline">
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}