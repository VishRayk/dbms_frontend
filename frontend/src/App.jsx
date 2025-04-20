import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import collegeLogo from './assets/college-logo.svg';
import { Link } from 'react-router-dom';

import VisitorForm from './components/VisitorForm.jsx';
import VisitorList from './components/VisitorList.jsx';
import StudentLogin from './components/StudentLogin.jsx';
import StudentSignup from './components/StudentSignup.jsx';
import Navigation from './components/Navigation.jsx';
import FacultyLogin from './components/FacultyLogin.jsx';
import FacultySignup from './components/FacultySignup.jsx';
import AdminSignup from './components/AdminSignup.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import CombinedLogin from './components/CombinedLogin.jsx';
import ScheduleAppointment from './components/ScheduleAppointment.jsx';
import ScheduledAppointments from './components/ScheduledAppointments.jsx';
import GuardLogin from './components/GuardLogin.jsx';
import ImageFetch from './components/Imagefetch.jsx';
import Home from './components/home.jsx';

function AppContent() {
  const location = useLocation();
  const [theme, setTheme] = useState('#ffffff');
  const [isNavOpen, setIsNavOpen] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsNavOpen(false);
      } else {
        setIsNavOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname, theme]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="min-h-screen flex font-sans" style={{
      backgroundColor: '#ffffff',
      backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}>
      {/* Sidebar only if not on /home */}
      {location.pathname !== '/home' && (
        <aside className={`${isNavOpen ? 'w-64' : 'w-0'} bg-white shadow-md transition-all duration-300 overflow-hidden`}>
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <Link to="/home">
                <img
                  src={collegeLogo}
                  alt="College Logo"
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-[#393086] mb-8 text-center">Visit IIITN</h1>
            <Navigation />
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-6">
          {/* Toggle Button */}
          {location.pathname !== '/home' && (
            <button
              onClick={toggleNav}
              className="mb-4 p-2 bg-white hover:bg-gray-200 rounded-md shadow text-gray-700 transition-all"
              aria-label="Toggle Navigation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          )}

          <div className="rounded-2xl shadow p-8 bg-white bg-opacity-90 backdrop-blur-sm min-h-[80vh] border border-gray-300">
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/home" element={<Home />} />
              <Route path="/visitor-form" element={<VisitorForm />} />
              <Route path="/visitor-list" element={<VisitorList />} />
              <Route path="/student-signup" element={<StudentSignup />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/faculty-login" element={<FacultyLogin />} />
              <Route path="/faculty-signup" element={<FacultySignup />} />
              <Route path="/admin-signup" element={<AdminSignup />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/login" element={<CombinedLogin />} />
              <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
              <Route path="/scheduled-appointment" element={<ScheduledAppointments />} />
              <Route path="/guard-login" element={<GuardLogin />} />
              <Route path="/image-fetch" element={<ImageFetch />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
