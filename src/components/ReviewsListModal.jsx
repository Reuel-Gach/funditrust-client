import { useEffect, useState } from 'react';
import { X, Star, User } from 'lucide-react';

const ReviewsListModal = ({ fundi, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews when modal opens
  useEffect(() => {
    fetch(`http://localhost:5000/api/reviews/${fundi.id}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, [fundi.id]);

  return (
    <div className="fixed inset-0 z-[5000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-3xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Reviews for {fundi.name}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{fundi.rating}</span>
              <span>• {reviews.length} reviews</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* The List */}
        <div className="overflow-y-auto p-5 space-y-4">
          
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading comments...</p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-300 mb-2 text-4xl">💬</p>
              <p className="text-gray-500">No reviews yet.</p>
              <p className="text-xs text-gray-400">Be the first to hire {fundi.name}!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-full">
                      <User size={14} className="text-blue-600" />
                    </div>
                    <span className="font-bold text-sm text-gray-900">Client</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < Math.round(review.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{review.comment}"</p>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
};

export default ReviewsListModal;