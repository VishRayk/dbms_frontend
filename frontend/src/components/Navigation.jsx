import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/visitor-form', label: 'Visitor Form' },
    { path: '/visitor-list', label: 'Visitor List' },
    { path: '/student-login', label: 'Student Login' },
    { path: '/faculty-login', label: 'Faculty Login' },
    { path: '/admin-signup', label: 'Admin Signup' },
    { path: '/admin-login', label: 'Admin Login' },
  ];

  return (
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
  );
}

export default Navigation;
