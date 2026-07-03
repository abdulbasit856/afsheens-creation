import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaHome, FaInfoCircle } from 'react-icons/fa';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/about', label: 'About', icon: FaInfoCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-playfair font-bold text-primary-600">
              Afsheen's
            </span>
            <span className="text-2xl font-playfair font-bold text-gray-700">
              Creations
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition-colors duration-200 ${
                  isActive(link.to)
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Only show Admin when logged in as admin */}
            {isAdmin() && (
              <Link
                to="/admin"
                className={`font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <FaCog className="text-sm" />
                  <span>Admin</span>
                </span>
              </Link>
            )}

            {/* Show user info + logout only when logged in */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  <FaUser className="inline mr-1" /> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-primary text-sm py-1 px-4"
                >
                  <FaSignOutAlt className="inline mr-1" /> Logout
                </button>
              </div>
            ) : (
              // HIDE LOGIN BUTTON - No login button visible for public
              <span className="text-sm text-gray-400">Welcome!</span>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-primary-600 transition-colors"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <link.icon className="text-sm" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Admin button - ONLY visible when logged in as admin */}
              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <FaCog className="text-sm" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    <FaUser className="inline mr-1" /> {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaSignOutAlt className="text-sm" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                // HIDE LOGIN BUTTON in mobile menu too
                <div className="px-4 py-2 text-sm text-gray-400">
                  👋 Welcome to Afsheen's Creations!
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;