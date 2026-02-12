import React from 'react';
import { BadgeCheck, MapPin, Phone, MessageCircle, X, Star, MessageSquare } from 'lucide-react';

const TrustCard = ({ fundi, onClose, onReview, onReadReviews }) => {
  return (
    <div className="absolute bottom-20 left-4 right-4 z-[2000] md:left-auto md:right-4 md:w-96">
      <div className="bg-white rounded-3xl shadow-2xl p-6 relative animate-in fade-in slide-in-from-bottom-4 duration-300 border border-gray-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img 
              src={fundi.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fundi.name}`} 
              alt={fundi.name} 
              className="w-20 h-20 rounded-full bg-gray-50 border-4 border-white shadow-md object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {fundi.name}
              </h2>
              {fundi.verified && (
                <BadgeCheck size={20} className="text-blue-500 fill-blue-500 text-white" />
              )}
            </div>
            
            <p className="text-gray-500 font-medium flex items-center gap-1 text-sm mt-1">
              <MapPin size={14} /> {fundi.skill}
            </p>
          </div>
        </div>

        {/* Stats Grid (Plain Stats Now) */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <p className="text-lg font-bold text-gray-900 flex justify-center items-center gap-1">
              {fundi.rating} <Star size={12} className="fill-yellow-400 text-yellow-400"/>
            </p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Rating</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <p className="text-lg font-bold text-gray-900">{fundi.vouches || 0}</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Vouches</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <p className="text-lg font-bold text-gray-900">{fundi.jobs || 0}</p>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Jobs</p>
          </div>
        </div>

        {/* --- NEW: EXPLICIT REVIEWS BUTTON --- */}
        <button 
          onClick={onReadReviews}
          className="w-full mb-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
        >
          <MessageSquare size={16} /> Read Client Reviews
        </button>

        {/* Contact Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a 
            href={`tel:${fundi.phone}`}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
          >
            <Phone size={18} /> Call
          </a>
          <a 
            href={`https://wa.me/${fundi.phone}`}
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-colors"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>

        {/* Verify Button */}
        <button 
          onClick={onReview}
          className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
        >
          <BadgeCheck size={16} /> Job Complete? Verify & Review
        </button>

      </div>
    </div>
  );
};

export default TrustCard;