import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-playfair font-bold text-white mb-4">Afsheen's Creations</h3>
            <p className="text-gray-400 mb-4">Discover delicious recipes from around the world, crafted with love and passion.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors"><FaYoutube size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors"><FaTwitter size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/admin/login" className="hover:text-primary-400 transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/?category=Pakistani" className="hover:text-primary-400 transition-colors">Pakistani</Link></li>
              <li><Link to="/?category=Arabic" className="hover:text-primary-400 transition-colors">Arabic</Link></li>
              <li><Link to="/?category=Indian" className="hover:text-primary-400 transition-colors">Indian</Link></li>
              <li><Link to="/?category=Dessert" className="hover:text-primary-400 transition-colors">Desserts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <p className="flex items-start space-x-3"><FaEnvelope className="text-primary-400 mt-1" /><span>info@afsheencreations.com</span></p>
              <p className="flex items-start space-x-3"><FaPhone className="text-primary-400 mt-1" /><span>+1 234 567 890</span></p>
              <p className="flex items-start space-x-3"><FaMapMarkerAlt className="text-primary-400 mt-1" /><span>123 Culinary Street, Food City</span></p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© {currentYear} Afsheen's Creations. All rights reserved.</p>
          <p className="text-sm text-gray-400 flex items-center mt-2 md:mt-0">Made with <FaHeart className="text-red-500 mx-1" /> by Afsheen's Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;