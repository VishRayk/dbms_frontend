import { useState } from 'react';
import axios from 'axios';

function ScheduleAppointment() {
  const [formData, setFormData] = useState({
    visitor_name: '',
    visitor_phone: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      console.log(token);
      const response = await axios.post(
        'http://localhost:3000/appointments/make-appointment',
        formData,
        {
          headers: {
            token:token,
          },
        }
      );
      console.log("hello");
      setMessage('Appointment scheduled successfully!');
      setFormData({
        visitor_name: '',
        visitor_phone: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error scheduling appointment.');
    }
  };

  const th = `max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg`;

  return (
    <div className={th}>
      <h2 className="text-2xl font-semibold mb-4 text-center">Schedule an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="visitor_name"
          value={formData.visitor_name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="text"
          name="visitor_phone"
          value={formData.visitor_phone}
          onChange={handleChange}
          placeholder="Your Phone Number"
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Schedule
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
    </div>
  );
}

export default ScheduleAppointment;
