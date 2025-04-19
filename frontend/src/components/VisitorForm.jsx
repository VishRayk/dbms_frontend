import { useState } from 'react';
import ImageFetch from './Imagefetch.jsx'; // import your OpenCV component here

export default function VisitorForm() {
  const [data, setData] = useState({
    visitor_name: '',
    visitor_phone: '',
    visiting_whom: '',
    visitor_type: ''
  });

  const [visitorId, setVisitorId] = useState(null);
  const [showImageCapture, setShowImageCapture] = useState(false);

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setVisitorId(resData.visitorId);       // store the ID
        setShowImageCapture(true);             // switch to image component
      } else {
        alert(resData.message || 'Failed to register visitor');
      }
    } catch (err) {
      alert('Error connecting to server');
      console.error(err);
    }
  };

  // 🔄 Conditional rendering
  if (showImageCapture && visitorId) {
    return <ImageFetch visitorId={visitorId} />;
  }

  // 📋 Visitor Form
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">New Visitor Entry</h2>

      <input
        name="visitor_name"
        value={data.visitor_name}
        onChange={handleChange}
        placeholder="Visitor Name"
        required
        className="w-full border border-gray-300 p-2 rounded"
      />

      <input
        name="visitor_phone"
        value={data.visitor_phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="w-full border border-gray-300 p-2 rounded"
      />

      <input
        name="visiting_whom"
        value={data.visiting_whom}
        onChange={handleChange}
        placeholder="Whom to Meet"
        required
        className="w-full border border-gray-300 p-2 rounded"
      />

      <select
        name="visitor_type"
        value={data.visitor_type}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 p-2 rounded"
      >
        <option value="">Select Visitor Type</option>
        <option value="student">Student</option>
        <option value="faculty">Faculty</option>
        <option value="adminstaff">Administration</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit Entry
      </button>
    </form>
  );
}
