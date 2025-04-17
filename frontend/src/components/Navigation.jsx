import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('theme', '#393086');
    navigate('/student-login');
  };

  const navItems = [
    { path: '/', label: '🏠 Home' },
    { path: '/guard-login', label: '🛡️ Guard Login' },
    ...(isLoggedIn ? [{ path: '/schedule-appointment', label: '📅 Schedule Appointment' },{ path: '/scheduled-appointment', label: '📅 Appointments Scheduled' }] : []),
    ...(isLoggedIn ? [] : [{ path: '/login', label: '🔑 Login' }]),
  ];

  return (
    <ul className="space-y-3">
      {navItems.map(({ path, label }) => (
        <li key={path}>
          <Link
            to={path}
            className={`block px-5 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm
              ${
                location.pathname === path
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'text-gray-700 hover:bg-gray-200 hover:text-indigo-700'
              }`}
          >
            {label}
          </Link>
        </li>
      ))}
      {isLoggedIn && (
        <li>
          <button
            onClick={handleLogout}
            className="w-full px-5 py-3 text-left text-red-600 font-semibold hover:bg-red-100 rounded-xl transition"
          >
            🚪 Logout
          </button>
        </li>
      )}
    </ul>
  );
}

export default Navigation;
