// utils/getNavItems.js

export default function getNavItems({ isStudentLoggedIn, isGuardLoggedIn, handleLogout }) {
    const navItems = [
      
  
      ...(!isStudentLoggedIn && !isGuardLoggedIn
        ? [{ path: '/guard-login', label: '🛡️ Guard Login' }]
        : []),
  
      ...(isStudentLoggedIn
        ? [
            { path: '/schedule-appointment', label: '📅 Schedule Appointment' },
            { path: '/scheduled-appointment', label: '📅 Appointments Scheduled' },
          ]
        : []),
  
      ...(isGuardLoggedIn
        ? [
            { path: '/visitor-form', label: '📝 Visitor Form' },
            { path: '/visitor-list', label: '📋 Visitor List' },
          ]
        : []),
  
      ...(!isStudentLoggedIn && !isGuardLoggedIn
        ? [{ path: '/login', label: '🔑 Login' }]
        : []),
  
      // Add logout item if logged in (student or guard)
      ...(isStudentLoggedIn || isGuardLoggedIn
        ? [{ path: '#', label: '🚪 Logout', onClick: handleLogout }]
        : []),
    ];
  
    return navItems;
}
