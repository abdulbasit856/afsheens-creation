import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const CommentItem = ({ comment }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const renderStars = (count) => {
    if (!count) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(count)) stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      else if (i === Math.floor(count) + 1 && count % 1 >= 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400 text-sm" />);
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">{comment.name.charAt(0).toUpperCase()}</div>
            <div><p className="font-semibold text-gray-800">{comment.name}</p><p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p></div>
          </div>
          {comment.rating && <div className="flex mt-1">{renderStars(comment.rating)}</div>}
        </div>
        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Verified</span>
      </div>
      <p className="mt-3 text-gray-700 leading-relaxed">{comment.content}</p>
    </div>
  );
};

export default CommentItem;