import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import VideoSearch from './components/VideoSearch';
import VideoDetails from './components/VideoDetails';
import CommentsSection from './components/CommentsSection';
import NotesSection from './components/NotesSection';
import './App.css';

const App = () => {
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleVideoFound = (video) => {
    setCurrentVideo(video);
  };

  const handleVideoUpdate = (updatedVideo) => {
    setCurrentVideo(updatedVideo);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
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
            
            {/* Right side decorative elements */}
            <div className="hidden sm:flex items-center space-x-2 mt-4 sm:mt-0">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-pink-200/60 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-red-200/60 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
          
          {/* Bottom decorative line */}
          <div className="mt-4 sm:mt-6 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <VideoSearch onVideoFound={handleVideoFound} />
        
        {currentVideo && (
          <div className="space-y-4 sm:space-y-6">
            <VideoDetails 
              video={currentVideo} 
              onVideoUpdate={handleVideoUpdate} 
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <CommentsSection video={currentVideo} />
              <NotesSection video={currentVideo} />
            </div>
          </div>
        )}
        
        {!currentVideo && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No video loaded</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter a YouTube video ID or URL above to get started with managing your video.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black border-t relative overflow-hidden mt-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-2 left-4 w-12 h-12 bg-red-500/10 rounded-full blur-lg"></div>
        <div className="absolute bottom-2 right-8 w-8 h-8 bg-pink-500/10 rounded-full blur-md"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm5 3a2 2 0 11-4 0 2 2 0 014 0zm7.5 7a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-.5a3 3 0 016 0v.5z"/>
                </svg>
              </div>
              <p className="text-gray-300 text-sm font-medium">
                YouTube Video Management Dashboard
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-xs">
                Built with ❤️ using React & Express
              </p>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>
          </div>
          
          {/* Decorative line */}
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
