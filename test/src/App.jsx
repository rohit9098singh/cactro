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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            YouTube Video Management Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your unlisted YouTube videos with ease
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VideoSearch onVideoFound={handleVideoFound} />
        
        {currentVideo && (
          <div className="space-y-6">
            <VideoDetails 
              video={currentVideo} 
              onVideoUpdate={handleVideoUpdate} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            YouTube Video Management Dashboard - Built with React and Express
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
