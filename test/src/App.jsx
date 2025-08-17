import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import VideoSearch from './components/VideoSearch';
import VideoDetails from './components/VideoDetails';
import CommentsSection from './components/CommentsSection';
import NotesSection from './components/NotesSection';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleVideoFound = (video) => {
    setCurrentVideo(video);
  };

  const handleVideoUpdate = (updatedVideo) => {
    setCurrentVideo(updatedVideo);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <Header />

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

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
