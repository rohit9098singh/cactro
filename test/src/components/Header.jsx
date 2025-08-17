import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 shadow-lg border-b relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-2 left-8 w-16 h-16 bg-pink-300/20 rounded-full blur-lg animate-bounce"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            {/* YouTube Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            </div>
            
            {/* Title and Description */}
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100">
                  YouTube Video Management
                </span>
                <br />
                <span className="text-lg sm:text-2xl font-semibold text-pink-100">
                  Dashboard
                </span>
              </h1>
              <p className="text-sm sm:text-base text-pink-100/90 mt-2 font-medium">
                🚀 Manage your unlisted YouTube videos with ease and style
              </p>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-white/20 transition-all duration-200"
                >
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-pink-100/80 text-xs">{user.email}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-white transition-transform duration-200 ${
                      showDropdown ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Decorative elements */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-pink-200/60 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-red-200/60 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative line */}
        <div className="mt-4 sm:mt-6 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
