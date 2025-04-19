import { useState, useEffect } from 'react';
import axios from 'axios';

function ScheduledAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get the user token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if the user is not logged in
      window.location.href = '/student-login';
    }

    // Fetch scheduled appointments for the logged-in user
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data); // Assume response contains appointment data
      } catch (err) {
        setMessage('Failed to load appointments');
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Scheduled Appointments</h2>
      
      {message && <div className="text-red-600">{message}</div>}

      {appointments.length === 0 ? (
        <p className="text-gray-600">You have no upcoming appointments.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} className="p-3 border-b">
              <h3 className="font-semibold">Appointment with {appointment.name}</h3>
              <p>{appointment.date}</p>
              <p>{appointment.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ScheduledAppointments;
