import { useState } from 'react';
import { X, MapPin, User, Phone, Wrench, Camera, Briefcase } from 'lucide-react';

// THE ULTIMATE KENYAN SERVICES LIST 🇰🇪
const jobCategories = [
  // --- A ---
  "Accountant/Tax Services",
  "Agrovet Services",
  "Architect/Draughtsman",
  
  // --- B ---
  "Baker/Cakes",
  "Barber (Kinyozi)",
  "Beauty/Cosmetics Shop",
  "Boda Boda Rider",
  "Butchery",

  // --- C ---
  "Carpenter",
  "Car Wash Services",
  "Catering/Events Cooking",
  "CCTV & Security Systems",
  "Cereal Shop (Wimbi/Maize)",
  "Cleaning Services",
  "Cobbler (Shoe Repair)",
  "Computer/Laptop Repair",
  "Cyber Cafe Services",
  "Cyber Security Consultant",

  // --- D ---
  "Data Entry/Virtual Assistant",
  "Delivery/Errands",
  "DJ/Entertainment",
  "Driver (Personal/Truck)",

  // --- E ---
  "Electrician",
  "Electronics Repair (TV/Fridge)",
  "Event Planner/Decor",

  // --- F ---
  "Farmhand/Shamba Boy",
  "Fashion Designer/Tailor",
  "Fruit Vendor (Managu/Fruits)",

  // --- G ---
  "Gardener/Landscaper",
  "Gas Delivery",
  "Glass & Glazing (Fundi wa Kioo)",
  "Graphic Designer",
  "Grocery/Mama Mboga",

  // --- H ---
  "Hairdresser/Salonist",
  "Hardware Store",
  "House Help/Nanny",

  // --- I ---
  "Interior Designer",
  "ISP/WiFi Installer",

  // --- L ---
  "Laundry (Dobi)",
  "Lawyer/Legal Services",

  // --- M ---
  "Make-up Artist",
  "Mason (Mjengo)",
  "Mechanic (Auto)",
  "Mechanic (Boda Boda)",
  "Milk Vendor/Dairy",
  "Movers/Relocation",

  // --- N ---
  "Nail Tech",

  // --- P ---
  "Painter",
  "Pest Control/Fumigation",
  "Phone Repair",
  "Photographer/Videographer",
  "Plumber",
  "Poultry Farmer (Eggs/Kienyeji)",
  "Printing & Branding",

  // --- R ---
  "Real Estate Agent",
  "Retail Shop/Kiosk",

  // --- S ---
  "Satellite/DSTV Installer",
  "Software Engineer/Developer",
  "Solar Systems Installer",

  // --- T ---
  "Taxi Driver",
  "Tutor/Private Teacher",

  // --- V ---
  "Veterinary Officer",

  // --- W ---
  "Water Vendor",
  "Web Designer",
  "Welder (Chuma)"
];

const RegisterModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    skill: jobCategories[0], 
    phone: '',
    locationName: '',
    image: null 
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file is too large. Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("🎉 Success! Welcome to FundiTrust.");
        window.location.reload(); 
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server Error: Could not connect.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 bg-gray-100 p-2 rounded-full transition-colors">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Join the Network 🇰🇪</h2>
          <p className="text-gray-500">Service Providers, Traders & Freelancers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* PHOTO UPLOAD */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-28 h-28 mb-3 group">
              <img 
                src={previewUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'new'}`} 
                alt="Preview" 
                className="w-full h-full rounded-full object-cover border-4 border-blue-50 shadow-lg group-hover:border-blue-200 transition-all"
              />
              <label className="absolute bottom-1 right-1 bg-blue-600 p-2.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg hover:scale-110">
                <Camera size={18} className="text-white" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Upload Profile Photo</p>
          </div>

          {/* Name */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:bg-blue-50/50 transition-all">
            <User className="text-gray-400" size={20} />
            <input 
              required
              placeholder="Business / Full Name"
              className="bg-transparent outline-none flex-1 text-gray-900 font-medium placeholder:text-gray-400"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:bg-blue-50/50 transition-all">
            <Phone className="text-gray-400" size={20} />
            <input 
              required
              placeholder="Phone (07XX...)"
              className="bg-transparent outline-none flex-1 text-gray-900 font-medium placeholder:text-gray-400"
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          {/* THE MEGA DROPDOWN */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:bg-blue-50/50 transition-all relative">
            <Briefcase className="text-gray-400" size={20} />
            <select 
              className="bg-transparent outline-none flex-1 text-gray-900 font-medium appearance-none cursor-pointer z-10"
              onChange={e => setFormData({...formData, skill: e.target.value})}
            >
              {jobCategories.map((job, index) => (
                <option key={index} value={job}>{job}</option>
              ))}
            </select>
            <div className="absolute right-4 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:bg-blue-50/50 transition-all">
            <MapPin className="text-gray-400" size={20} />
            <input 
              required
              placeholder="Base Town (e.g. Roysambu)"
              className="bg-transparent outline-none flex-1 text-gray-900 font-medium placeholder:text-gray-400"
              onChange={e => setFormData({...formData, locationName: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Creating Profile..." : "Register Now"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RegisterModal;