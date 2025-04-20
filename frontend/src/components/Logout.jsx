import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session data
   
    localStorage.removeItem('token');

    // Navigate to login page
    navigate('/login');
  }, [navigate]);

  return null; // No UI needed, purely functional
}

export default Logout;
