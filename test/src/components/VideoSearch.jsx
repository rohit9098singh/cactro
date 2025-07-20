import { useState } from 'react';
import { videoAPI } from '../services/api';
import toast from 'react-hot-toast';

const VideoSearch = ({ onVideoFound }) => {
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoId.trim()) {
      toast.error('Please enter a YouTube video ID or URL');
      return;
    }

    setLoading(true);
    try {
      const extractedId = extractVideoId(videoId.trim());
      const response = await videoAPI.getVideo(extractedId);
      
      if (response.data.success) {
        onVideoFound(response.data.data);
        toast.success('Video loaded successfully!');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Load Your YouTube Video</h2>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter YouTube video ID or URL"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </>
          ) : (
            'Load Video'
          )}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-2">
        You can paste a full YouTube URL or just the video ID. Make sure the video is unlisted and you have access to it.
      </p>
    </div>
  );
};

export default VideoSearch;
