import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEnvelope, FaLock, FaUtensils } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } else {
      toast.error(result.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-pink-50 to-white py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl mb-4">
            <FaUtensils className="text-4xl text-primary-600" />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-1">Access the Afsheen's Creations admin panel</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label-field">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="admin@afsheencreations.com" required />
              </div>
            </div>
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10" placeholder="Enter your password" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <span className="flex items-center justify-center"><span className="loading-spinner w-5 h-5 mr-2"></span>Logging in...</span> : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            <Link to="/" className="text-primary-600 hover:text-primary-700 transition-colors">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;