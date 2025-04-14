import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CombinedLogin() {
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Added useNavigate here

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    navigate(`/${selectedRole}-login`);  // Redirect to selected role's login page
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/auth/${role}/login`, formData);
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      // Redirect to the appointment scheduling page after successful login
      navigate('/schedule-appointment');  // Redirect here
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {!role ? (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center">Choose Your Role to Login</h2>
          <div className="flex flex-col space-y-4">
            <button onClick={() => handleRoleSelect('student')} className="bg-blue-500 text-white py-3 rounded-lg text-lg hover:bg-blue-600">
              Student
            </button>
            <button onClick={() => handleRoleSelect('faculty')} className="bg-green-500 text-white py-3 rounded-lg text-lg hover:bg-green-600">
              Faculty
            </button>
            <button onClick={() => handleRoleSelect('admin')} className="bg-purple-500 text-white py-3 rounded-lg text-lg hover:bg-purple-600">
              Admin Staff
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center capitalize">{role} Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Don’t have an account?{' '}
            <Link to={`/${role}-signup`} className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

export default CombinedLogin;
