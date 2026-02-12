import { useState } from 'react';
import { X, Star, CheckCircle, Smartphone, Loader2 } from 'lucide-react';
import API_URL from "../config";

const ReviewModal = ({ fundi, onClose }) => {
  const [step, setStep] = useState(1); 
  
  // Payment State
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(''); // ✅ Now editable by user
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  // Review State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mpesaCode, setMpesaCode] = useState(''); 

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || amount < 1) {
      alert("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      const res = await fetch('${API_URL}/api/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount }) // ✅ Sends the typed amount
      });
      const data = await res.json();

      if (res.ok) {
        setMpesaCode(data.checkoutRequestID || "PENDING"); 
        setStep(2); 
      } else {
        setPaymentError(data.message);
      }
    } catch (err) {
      console.error(err);
      setPaymentError("Connection Error. Is the backend running?");
    }
    setIsProcessing(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) { alert("Please click a star rating!"); return; }

    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${fundi.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, mpesaCode })
      });
      if (res.ok) {
        alert("🎉 Review Submitted! Thank you.");
        onClose();
        window.location.reload();
      }
    } catch (err) { alert("Failed to submit review"); }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
          <X size={24} />
        </button>

        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Smartphone size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pay {fundi.name}</h2>
              <p className="text-gray-500 text-sm">Enter amount & phone to verify.</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              
              {/* ✅ NEW: Amount Input Field */}
              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Amount (KES)</label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-4 text-gray-400 font-bold">KES</span>
                  <input 
                    type="number" 
                    placeholder="e.g. 500"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-14 p-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">M-Pesa Number</label>
                <input 
                  type="text" 
                  placeholder="07XX XXX XXX"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mt-1 text-lg font-medium outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {paymentError && (
                <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg text-center">
                  {paymentError}
                </p>
              )}

              <button 
                disabled={isProcessing}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : "Pay Now"}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Sent!</h2>
              <p className="text-gray-500 text-sm">Check your phone to complete PIN.</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setRating(star)}>
                    <Star size={32} className={`transition-all ${rating >= star ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                placeholder="Write a review..."
                required
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 resize-none"
                onChange={e => setComment(e.target.value)}
              ></textarea>
              <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-black transition-all">
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;