import { useState } from 'react';
import axios from 'axios';

function ScheduleAppointment() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
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
      const response = await axios.post('http://localhost:3000/appointments/schedule', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Appointment scheduled successfully!');
      setFormData({ date: '', time: '', reason: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error scheduling appointment.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Schedule an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded"
        />
        <textarea
          name="reason"
          placeholder="Reason for appointment"
          value={formData.reason}
          onChange={handleChange}
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
