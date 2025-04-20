import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CombinedLogin() {
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    navigate(`/${selectedRole}-login`);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`http://localhost:3000/auth/${role}/login`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('theme', 'green-orange');
      navigate('/schedule-appointment');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen px-4 py-10"
      style={{ background: "linear-gradient(135deg, #382f86 0%, #cf5924 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {!role ? (
            <div className="px-6 py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Your Role</h2>
              
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => handleRoleSelect('student')} 
                  className="py-4 rounded-lg text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: "#382f86" }}
                >
                  Student
                </button>
                
                <button 
                  onClick={() => handleRoleSelect('faculty')} 
                  className="py-4 rounded-lg text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: "#382f86" }}
                >
                  Faculty
                </button>
                
                <button 
                  onClick={() => handleRoleSelect('admin')} 
                  className="py-4 rounded-lg text-white font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: "#382f86" }}
                >
                  Admin Staff
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="px-6 pt-6 pb-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 capitalize">{role} Login</h2>
                
                {error && (
                  <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}
              </div>
              
              <form onSubmit={handleLogin} className="px-6 pb-6">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    style={{ "--tw-ring-color": "#382f86" }}
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <a 
                      href="#" 
                      className="text-sm hover:underline transition-colors"
                      style={{ color: "#382f86" }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-blue-500 text-gray-700"
                    style={{ "--tw-ring-color": "#382f86" }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-70"
                  style={{ backgroundColor: "#382f86" }}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to={`/${role}-signup`}
                      className="font-medium hover:underline transition-colors"
                      style={{ color: "#cf5924" }}
                    >
                      Sign Up
                    </Link>
                  </p>
                  
                  <button 
                    onClick={() => setRole(null)}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                  >
                    ← Back to role selection
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CombinedLogin;