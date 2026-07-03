import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CommentItem from './CommentItem';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaStar, FaRegStar } from 'react-icons/fa';

const CommentSection = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [ratingStats, setRatingStats] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    content: ''  // Removed email
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchComments = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/comments/recipe/${recipeId}?page=${page}&limit=${pagination.limit}`);
      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
        setPagination(data.pagination);
        setRatingStats(data.rating);
      }
    } catch (error) { 
      console.error('Error fetching comments:', error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchComments(); 
  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          recipeId, 
          ...formData, 
          rating: rating > 0 ? rating : null 
        }),
      });
      const data = await response.json();
      // Update the success message when comment is submitted
      if (data.success) {
         toast.success('Comment added successfully!');
         setFormData({ name: '', content: '' });
         setRating(0);
         fetchComments();
      } else {
        toast.error(data.message || 'Failed to submit comment');
      }
    } catch (error) { 
      toast.error('Failed to submit comment'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleChange = (e) => setFormData({ 
    ...formData, 
    [e.target.name]: e.target.value 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-playfair font-bold text-gray-800">
          Comments ({pagination.total})
        </h3>
        {ratingStats && (
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                const filled = starValue <= Math.floor(ratingStats.average);
                const halfFilled = starValue === Math.floor(ratingStats.average) + 1 && ratingStats.average % 1 >= 0.5;
                return (
                  <span key={i}>
                    {filled ? (
                      <FaStar className="text-yellow-400 text-sm" />
                    ) : halfFilled ? (
                      <FaStarHalfAlt className="text-yellow-400 text-sm" />
                    ) : (
                      <FaRegStar className="text-yellow-400 text-sm" />
                    )}
                  </span>
                );
              })}
            </div>
            <span className="text-sm text-gray-600">
              ({ratingStats.count} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Comment Form - No Email Field */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6">
        <div className="mb-4">
          <label className="label-field">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Your name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="label-field">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                {star <= (hoverRating || rating) ? (
                  <FaStar className="text-yellow-400 text-2xl" />
                ) : (
                  <FaRegStar className="text-yellow-400 text-2xl" />
                )}
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-500 self-center">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="label-field">Comment *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="4"
            className="input-field"
            placeholder="Share your thoughts about this recipe..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full md:w-auto"
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <span className="loading-spinner w-5 h-5 mr-2"></span>
              Submitting...
            </span>
          ) : (
            'Submit Comment'
          )}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => fetchComments(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-600">
            {pagination.page} / {pagination.pages}
          </span>
          <button
            onClick={() => fetchComments(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;