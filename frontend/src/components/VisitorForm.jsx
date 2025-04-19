import { useState } from 'react';

export default function VisitorForm() {
  const [data, setData] = useState({
    name: '', email: '', phone: '', purpose: '', whomToMeet: '', type: ''
  });

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Visitor registered successfully!');
      } else {
        alert('Failed to register visitor');
      }
    } catch (err) {
      alert('Error connecting to server');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg space-y-4">
    <h2 className="text-2xl font-bold text-center">Register Visitor</h2>
    
    {['name', 'email', 'phone', 'purpose', 'whomToMeet'].map(field => (
      <input
        key={field}
        name={field}
        value={data[field]}
        onChange={handleChange}
        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
    ))}
  
    <select
      name="type"
      value={data.type}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 p-2 rounded"
    >
      <option value="">Select Type</option>
      <option value="student">Student</option>
      <option value="staff">Staff</option>
      <option value="guest">Guest</option>
    </select>
  
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      Register
    </button>
  </form>
  );
}
