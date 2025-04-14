import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import CombinedLogin from './components/CombinedLogin';

import ScheduleAppointment from './components/ScheduleAppointment';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex bg-gray-100 font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-blue-600 mb-8">Visitor Admin</h1>
          <Navigation />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow p-8 min-h-[80vh]">
            <Routes>
              <Route path="/visitor-form" element={<VisitorForm />} />
              {/* <Route path="/visitor-list" element={<VisitorList />} /> */}
             
              <Route path="/student-signup" element={<StudentSignup />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/faculty-login" element={<FacultyLogin/>}/>
              <Route path="/faculty-signup" element={<FacultySignup/>}/>
              <Route path="/admin-signup" element={<AdminSignup/>}/>
              <Route path="/admin-login" element={<AdminLogin/>}/>
              <Route path="/login" element={<CombinedLogin />} />
              <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
              <Route path="/" element={
                <div className="text-3xl font-semibold text-center text-gray-700">
                  Welcome to the <span className="text-blue-500">Home Page</span>!
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
