import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const checkAuth = () => {
    const user = localStorage.getItem('username');
    if (user) {
      setIsLoggedIn(true);
      setUsername(user);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('userLoggedIn', checkAuth);
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('userLoggedIn', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');

    // ✅ Notify Feature component to clear its state
    window.dispatchEvent(new Event('userLoggedOut'));

    alert('Logged out successfully!');

    // ✅ Redirect to home page after logout
    navigate('/');
  };

  return (
    <>
      <header className="fixed w-full z-50 bg-white bg-opacity-90 backdrop-blur-md shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">FitTrack</span>
          </motion.div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition duration-300">Home</Link>
            <Link to="/feature" className="text-gray-600 hover:text-gray-900 transition duration-300">Workout</Link>
            <Link to="/health" className="text-gray-600 hover:text-gray-900 transition duration-300">Health</Link>
            {isLoggedIn ? (
              <>
                <span className="text-gray-600">Hi, {username}</span>
                <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 transition duration-300">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition duration-300">Login</Link>
                <Link to="/signup" className="text-gray-600 hover:text-gray-900 transition duration-300">Signup</Link>
              </>
            )}
          </div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </nav>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition duration-300">Home</Link>
                <Link to="/feature" className="text-gray-600 hover:text-gray-900 transition duration-300">Workout</Link>
                <Link to="/health" className="text-gray-600 hover:text-gray-900 transition duration-300">Health</Link>
                <Link to="/period" className="text-gray-600 hover:text-gray-900 transition duration-300">Period</Link>
                {isLoggedIn ? (
                  <>
                    <span className="text-gray-600">Hi, {username}</span>
                    <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 transition duration-300">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-600 hover:text-gray-900 transition duration-300">Login</Link>
                    <Link to="/signup" className="text-gray-600 hover:text-gray-900 transition duration-300">Signup</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Navbar;
