import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const isStudentLoggedIn = localStorage.getItem('token');
  const isGuardLoggedIn = localStorage.getItem('guardLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('theme', '#393086');
    navigate('/student-login');
  };

  const handleGuardLogout = () => {
    localStorage.removeItem('guardLoggedIn');
    navigate('/guard-login');
  };

  const navItems = [
    { path: '/', label: '🏠 Home' },

    // Show only if NOT logged in as student or guard
    ...(!isStudentLoggedIn && !isGuardLoggedIn
      ? [{ path: '/guard-login', label: '🛡️ Guard Login' }]
      : []),

    // Student-specific
    ...(isStudentLoggedIn
      ? [
          { path: '/schedule-appointment', label: '📅 Schedule Appointment' },
          { path: '/scheduled-appointment', label: '📅 Appointments Scheduled' },
        ]
      : []),

    // Guard-specific
    ...(isGuardLoggedIn
      ? [
          { path: '/visitor-form', label: '📝 Visitor Form' },
          { path: '/visitor-list', label: '📋 Visitor List' },
        ]
      : []),

    // Login link if not logged in
    ...(!isStudentLoggedIn && !isGuardLoggedIn
      ? [{ path: '/login', label: '🔑 Login' }]
      : []),
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

      {isStudentLoggedIn && (
        <li>
          <button
            onClick={handleLogout}
            className="w-full px-5 py-3 text-left text-red-600 font-semibold hover:bg-red-100 rounded-xl transition"
          >
            🚪 Logout (Student)
          </button>
        </li>
      )}

      {isGuardLoggedIn && (
        <li>
          <button
            onClick={handleGuardLogout}
            className="w-full px-5 py-3 text-left text-red-600 font-semibold hover:bg-red-100 rounded-xl transition"
          >
            🚪 Logout (Guard)
          </button>
        </li>
      )}
    </ul>
  );
}

export default Navigation;
