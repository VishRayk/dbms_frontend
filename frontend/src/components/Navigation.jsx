import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in by checking the token in localStorage
  const isLoggedIn = localStorage.getItem('token');
  
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    localStorage.setItem('theme','#393086');
    // setTheme('default');
    // Redirect to the login page after logging out
    navigate('/student-login');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    // { path: '/visitor-form', label: 'Visitor Form' },
    { path: '/guard-login', label: 'Guard Login' },
    // Show the 'Schedule Appointment' link only if logged in
    ...(isLoggedIn ? [{ path: '/schedule-appointment', label: 'Schedule Appointment' }] : []),
    // Show the 'Login' link only if not logged in
    ...(isLoggedIn ? [] : [{ path: '/login', label: 'Login' }]),
  ];

  return (
    <ul className="space-y-3">
      {navItems.map(({ path, label }) => (
        <li key={path}>
          <Link
            to={path}
            className={`block px-4 py-2 rounded-lg font-medium transition-all duration-200 
              ${location.pathname === path
                ? 'bg-blue-100 text-[#393086]'
                : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {label}
          </Link>
        </li>
      ))}
      {/* Show the logout button only if logged in */}
      {isLoggedIn && (
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-red-600 hover:bg-gray-100 p-3 rounded-lg"
          >
            Logout
          </button>
        </li>
      )}
    </ul>
  );
}

export default Navigation;
