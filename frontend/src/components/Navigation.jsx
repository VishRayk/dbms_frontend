import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]); // refresh status on route change

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('theme');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/visitor-form', label: 'Visitor Form' },
    { path: '/visitor-list', label: 'Visitor List' },
    // Show Login link only if not logged in
    ...(!isLoggedIn ? [{ path: '/login', label: 'Login' }] : []),
  ];

  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {navItems.map(({ path, label }) => (
          <li key={path}>
            <Link
              to={path}
              className={`block px-4 py-2 rounded-lg font-medium transition-all duration-200 
                ${location.pathname === path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="mt-6 block w-full bg-red-500 text-white px-4 py-2 rounded-lg text-center hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Navigation;
