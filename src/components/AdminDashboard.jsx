import { useState, useEffect } from 'react';
import { Shield, Check, X, Trash2, UserCheck, AlertCircle, Lock, Key } from 'lucide-react';

const AdminDashboard = ({ onClose }) => {
  // 1. SECURITY STATE
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const [fundis, setFundis] = useState([]);

  // 2. Fetch Logic
  const fetchFundis = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/fundis');
      const data = await res.json();
      setFundis(data);
    } catch (err) {
      console.error("Failed to fetch fundis", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFundis();
    }
  }, [isAuthenticated]);

  // 3. Verify Logic
  const handleVerify = async (id) => {
    if(!confirm("Are you sure you want to verify this Fundi?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/verify/${id}`, { method: 'PUT' });
      if (res.ok) {
        setFundis(fundis.map(f => f.id === id ? { ...f, verified: true } : f));
      }
    } catch (err) { alert("Action failed"); }
  };

  // 4. DELETE Logic
  const handleDelete = async (id) => {
    const isConfirmed = confirm("⚠️ WARNING: This will permanently delete this Fundi and all their reviews. Are you sure?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/fundis/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFundis(fundis.filter(f => f.id !== id)); 
        alert("Fundi has been removed.");
      }
    } catch (err) { alert("Delete failed"); }
  };

  // 5. LOGIN LOGIC (UPDATED)
  const handleLogin = (e) => {
    e.preventDefault();
    // --- 🔐 THE NEW SECRET PIN ---
    if (pin === "5818") { 
      setIsAuthenticated(true);
    } else {
      setError("❌ Access Denied.");
      setPin("");
    }
  };

  // --- RENDER: THE LOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[4000] bg-slate-900 flex items-center justify-center font-sans p-4">
        <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-2xl text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h2>
          <p className="text-gray-500 mb-6">Enter Admin PIN to continue.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="w-full text-center text-2xl tracking-widest p-3 border border-gray-300 rounded-xl outline-none focus:border-blue-500 transition-all"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm font-bold animate-pulse">{error}</p>}
            
            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2">
              <Key size={18} /> Unlock Dashboard
            </button>
            <button type="button" onClick={onClose} className="text-gray-400 text-sm hover:text-gray-600 underline">
              Go Back to Map
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER: THE DASHBOARD (Unlocked) ---
  return (
    <div className="fixed inset-0 z-[4000] bg-gray-50 flex flex-col font-sans">
      
      {/* Navbar */}
      <div className="bg-slate-900 text-white p-5 shadow-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-blue-400" />
          <h1 className="text-xl font-bold">Admin Central</h1>
        </div>
        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
          <X size={18} /> Logout
        </button>
      </div>

      {/* Main Table */}
      <div className="p-6 max-w-7xl mx-auto w-full overflow-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Skill</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fundis.map((fundi) => (
                <tr key={fundi.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img 
                      src={fundi.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fundi.name}`} 
                      className="w-8 h-8 rounded-full bg-gray-100"
                    />
                    {fundi.name}
                  </td>
                  <td className="p-4 text-gray-500">{fundi.skill}</td>
                  <td className="p-4">
                    {fundi.verified ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">Verified</span>
                    ) : (
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-bold">Pending</span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2">
                    {!fundi.verified && (
                      <button 
                        onClick={() => handleVerify(fundi.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-1"
                      >
                        <Check size={14} /> Approve
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(fundi.id)}
                      className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-100 flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Ban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;