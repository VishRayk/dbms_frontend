import { useState } from 'react';
import ImageFetch from './Imagefetch.jsx';

export default function VisitorForm() {
  const [data, setData] = useState({
    visitor_name: '',
    visitor_phone: '',
    visiting_whom: '',
    visitor_type: ''
  });

  const [visitorId, setVisitorId] = useState(null);
  const [showImageCapture, setShowImageCapture] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...data,
      intime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    try {
      const response = await fetch('http://localhost:3000/visitor/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (response.ok) {
        alert('Visitor entry made successfully!');
        setVisitorId(resData.visitorId);
        setShowImageCapture(true);
      } else {
        alert(resData.message || 'Failed to register visitor');
      }
    } catch (err) {
      alert('Error connecting to server');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Conditional rendering
  if (showImageCapture && visitorId) {
    return <ImageFetch visitorId={visitorId} />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#393086] to-[#cf5924]"></div>
      
      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 rounded-3xl shadow-2xl overflow-hidden">
        {/* Content Section */}
        <div className="px-8 pt-8 pb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[#393086] mb-6">
            New Visitor Entry
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="visitor_name"
                value={data.visitor_name}
                onChange={handleChange}
                placeholder="Visitor Name"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#393086] text-gray-700"
              />
            </div>

            <div>
              <input
                name="visitor_phone"
                value={data.visitor_phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#393086] text-gray-700"
              />
            </div>

            <div>
              <input
                name="visiting_whom"
                value={data.visiting_whom}
                onChange={handleChange}
                placeholder="Whom to Meet"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#393086] text-gray-700"
              />
            </div>

            <div>
              <select
                name="visitor_type"
                value={data.visitor_type}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#393086] text-gray-700"
              >
                <option value="">Select Visitor Type</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="adminstaff">Administration</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-2 bg-[#393086] hover:bg-[#2f276e] text-white font-semibold rounded-xl shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              {isSubmitting ? "Processing..." : "Submit Entry"}
            </button>
          </form>
          
          {/* Footer Section */}
          <div className="mt-10 text-center text-sm text-gray-500">
            <p>© 2025 Indian Institute of Information Technology, Nagpur</p>
          </div>
        </div>
      </div>
    </div>
  );
}