import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

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

function AppContent() {
  // Initialize default theme if not present
  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', '#393086');
    }
  }, []);

  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || '#393086');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [location.pathname]);

  // Determine theme background class
  let themeClass = '';
  if (theme === 'green-orange') {
    themeClass = 'bg-gradient-to-br from-green-500 to-yellow-200';
  } else if (theme === '#393086') {
    themeClass = 'bg-[#393086]';
  } else {
    // Fallback
    themeClass = 'bg-gray-200';
  }

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-[#393086] mb-8">Visitor Admin</h1>
        <Navigation />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className={`${themeClass} rounded-2xl shadow p-8 min-h-[80vh]`}>
          <Routes>
            <Route path="/" element={
              <div className="text-3xl font-semibold text-center text-gray-700">
                Welcome to the <span className="text-blue-500">Home Page</span>!
              </div>
            } />
            <Route path="/visitor-form" element={<VisitorForm />} />
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

          </Routes>
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
