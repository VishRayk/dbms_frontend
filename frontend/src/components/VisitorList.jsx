// src/components/VisitorList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VisitorList() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/user/all')
      .then(res => setVisitors(res.data))
      .catch(err => console.error('Error loading visitors', err));
  }, []);

  return (
    <div>
      <h2>Visitor List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Phone</th><th>Type</th><th>Check-In</th><th>Check-Out</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v, i) => (
            <tr key={i}>
              <td>{v.name}</td>
              <td>{v.phone}</td>
              <td>{v.type}</td>
              <td>{v.checkin_time}</td>
              <td>{v.checkout_time || 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
