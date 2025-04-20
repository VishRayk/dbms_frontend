import { Link, useNavigate } from 'react-router-dom';
import getNavItems from '../utils/getNavItems';
import collegeLogo from '../assets/college-logo.svg';

function Home() {
  const navigate = useNavigate();
  var isStudentLoggedIn = localStorage.getItem('token');

  var isGuardLoggedIn = localStorage.getItem('guardLoggedIn') === 'true';
  var boole=isStudentLoggedIn&&!isGuardLoggedIn
  const handleLogout = () => {
    isStudentLoggedIn=false
    isGuardLoggedIn=false
    localStorage.removeItem('token');
    localStorage.removeItem('guardLoggedIn');
    localStorage.setItem('theme', '#393086');
    navigate('/student-login');
  };

  const navItems = getNavItems({ isStudentLoggedIn, isGuardLoggedIn, handleLogout });

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4 md:p-8 relative"
      style={{ 
        backgroundImage: "url('https://iiitn.ac.in/images/album/upcoming-campus-photo//16.jpeg')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for better text contrast */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
      
      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-lg bg-white bg-opacity-95 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white border-opacity-20 transition-all duration-500 hover:shadow-xl">
        {/* College Logo Section with subtle animation */}
        <div className="flex justify-center pt-8 mb-6">
          <Link to="/home" className="transition-transform duration-300 hover:scale-105">
            <img
              src={collegeLogo}
              alt="College Logo"
              className="h-20 w-auto object-contain drop-shadow-md"
            />
          </Link>
        </div>
        
        {/* Content Section */}
        <div className="px-8 pb-12">
          <h1 className="text-3xl font-bold text-center text-[#393086] mb-10 relative">
            Welcome to Visit IIITN
            <span className="block h-1 w-24 bg-[#393086] mx-auto mt-3 rounded-full"></span>
          </h1>

          <div className="space-y-4">
            {navItems.map(({ path, label, onClick }, index) => (
              <button
                key={label}
                onClick={() => {
                  if (onClick) {
                    onClick();
                  } else {
                    navigate(path);
                  }
                }}
                className="w-full bg-gradient-to-r from-[#393086] to-[#4b3fad] hover:from-[#2f276e] hover:to-[#393086] text-white font-medium py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <span className="drop-shadow-sm">{label}</span>
              </button>
            ))}
          </div>
          
          {/* Footer Section */}
          <div className="mt-16 text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
            <p>© 2025 Indian Institute of Information Technology, Nagpur</p>
            <p className="text-xs text-gray-500 mt-1">A Centre of Excellence in Education and Research</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;