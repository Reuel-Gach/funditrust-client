import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Shield } from 'lucide-react';
import API_URL from './config';

// Components
import TrustCard from './components/TrustCard';
import ReviewModal from './components/ReviewModal';
import RegisterModal from './components/RegisterModal';
import AdminDashboard from './components/AdminDashboard';
import ReviewsListModal from './components/ReviewsListModal'; // Make sure this is imported!

// --- 1. THE WHATSAPP AVATAR PIN MAKER ---
const createAvatarIcon = (imageUrl, isVerified) => {
  return L.divIcon({
    className: "custom-avatar-icon", 
    html: `
      <div style="
        position: relative;
        width: 50px;
        height: 50px;
      ">
        <div style="
          background-image: url('${imageUrl}');
          background-size: cover;
          background-position: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        "></div>
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background-color: white;
          z-index: -1;
        "></div>
        ${isVerified ? `
          <div style="
            position: absolute;
            bottom: -2px;
            right: -6px;
            width: 24px;
            height: 24px;
            z-index: 10;
            filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
          ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" stroke="none">
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74z"></path>
              <path fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"></path>
            </svg>
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 55],
    popupAnchor: [0, -50],
  });
};

function App() {
  // --- 2. STATE VARIABLES ---
  const [selectedFundi, setSelectedFundi] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isReadingReviews, setIsReadingReviews] = useState(false); // New State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [fundis, setFundis] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");

  // --- 3. FETCH REAL DATA ---
  useEffect(() => {
    fetch('${API_URL}/api/fundis')
      .then(res => res.json())
      .then(data => setFundis(data))
      .catch(err => console.error("Error fetching fundis:", err));
  }, []);

  // --- 4. FILTER LOGIC ---
  const visibleFundis = fundis.filter((fundi) => {
    const query = searchQuery.toLowerCase();
    return (
      fundi.name.toLowerCase().includes(query) || 
      fundi.skill.toLowerCase().includes(query)
    );
  });

  return (
    <div className="h-screen w-screen relative font-sans">
      
      {/* A. MAP LAYER */}
      <MapContainer 
        center={[0.040, 36.370]} 
        zoom={14} 
        zoomControl={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {visibleFundis.map((fundi) => (
          <Marker 
            key={fundi.id} 
            position={[fundi.lat, fundi.lng]} 
            icon={createAvatarIcon(
              fundi.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fundi.name}`, 
              fundi.verified
            )}
            eventHandlers={{
              click: () => {
                setSelectedFundi(fundi);
              },
            }}
          />
        ))}
      </MapContainer>

      {/* B. SEARCH BAR */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-200 flex items-center gap-3 px-5 transition-all focus-within:ring-2 focus-within:ring-blue-500">
           <span className="text-xl">🔍</span>
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search 'Plumber'..." 
             className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-500"
           />
           {searchQuery && (
             <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
               ✕
             </button>
           )}
        </div>
      </div>

      {/* C. JOIN BUTTON */}
      <button 
        onClick={() => setIsRegistering(true)}
        className="absolute top-20 right-4 z-[1000] bg-black text-white px-4 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span>+</span> Join
      </button>

      {/* D. SECRET ADMIN BUTTON */}
      <button 
        onClick={() => setIsAdminOpen(true)}
        className="absolute bottom-6 left-6 z-[1000] bg-slate-900/80 hover:bg-slate-900 text-white p-3 rounded-2xl backdrop-blur-md transition-all border border-white/20 shadow-xl"
      >
        <Shield size={24} />
      </button>

      {/* --- E. MODALS --- */}

      {/* 1. Register Modal */}
      {isRegistering && <RegisterModal onClose={() => setIsRegistering(false)} />}
      
      {/* 2. Admin Dashboard */}
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}

      {/* 3. Trust Card (Profile) - Handles "Read Reviews" click */}
      {selectedFundi && !isReviewing && !isReadingReviews && (
        <TrustCard 
          fundi={selectedFundi} 
          onClose={() => setSelectedFundi(null)}
          onReview={() => setIsReviewing(true)}
          onReadReviews={() => setIsReadingReviews(true)} 
        />
      )}

      {/* 4. Review Modal */}
      {isReviewing && selectedFundi && (
        <ReviewModal 
          fundi={selectedFundi} 
          onClose={() => setIsReviewing(false)} 
        />
      )}

      {/* 5. Reviews List Modal (NEW) */}
      {isReadingReviews && selectedFundi && (
        <ReviewsListModal 
          fundi={selectedFundi}
          onClose={() => setIsReadingReviews(false)}
        />
      )}
      
    </div>
  )
}

export default App;