import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaComments, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const fetchComments = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/comments/all?page=${page}&limit=20`);
      if (response.data.success) {
        setComments(response.data.comments);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, []);

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const response = await api.delete(`/comments/${commentId}`);
      if (response.data.success) {
        toast.success('Comment deleted!');
        fetchComments(pagination.page);
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const filteredComments = comments.filter(comment => 
    comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (comment.recipeId?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900 flex items-center gap-2">
              <FaComments className="text-primary-500" /> Comment Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all user comments (auto-approved)
            </p>
          </div>
          <Link to="/admin" className="btn-secondary flex items-center mt-4 md:mt-0">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-sm text-gray-500">Total Comments</span>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, comment, or recipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Comments List */}
        {filteredComments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No comments found</p>
            <p className="text-gray-400 text-sm">Comments will appear here when users submit them</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredComments.map((comment) => (
                <div key={comment._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-gray-900">{comment.name}</span>
                            {comment.rating && (
                              <span className="text-yellow-500 text-sm">
                                {'⭐'.repeat(comment.rating)}
                              </span>
                            )}
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              ✓ Approved
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            on "{comment.recipeId?.title || 'Unknown Recipe'}"
                          </p>
                          <p className="text-gray-700 mt-2 break-words">{comment.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                          {comment.email && (
                            <p className="text-xs text-gray-400 mt-1">
                              📧 {comment.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 self-start md:self-center">
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <FaTrash className="text-xs" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            <button
              onClick={() => fetchComments(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchComments(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;