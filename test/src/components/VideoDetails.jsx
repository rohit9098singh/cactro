import { useState } from 'react';
import { videoAPI } from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const VideoDetails = ({ video, onVideoUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(video?.title || '');
  const [description, setDescription] = useState(video?.description || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
      const response = await videoAPI.updateVideo(video.youtubeId, {
        title: title.trim(),
        description: description.trim()
      });

      if (response.data.success) {
        onVideoUpdate(response.data.data);
        setIsEditing(false);
        toast.success('Video updated successfully!');
      }
    } catch (error) {
      console.error('Error updating video:', error);
      toast.error(error.response?.data?.message || 'Failed to update video');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setTitle(video?.title || '');
    setDescription(video?.description || '');
    setIsEditing(false);
  };

  if (!video) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">No video selected. Use the search above to load a video.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Video Details</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm self-start"
          >
            Edit
          </button>
        )}
      </div>

      {/* Video Thumbnail and Basic Info */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="lg:w-1/3">
          {video.thumbnail && (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full rounded-lg shadow-sm"
            />
          )}
        </div>
        
        <div className="lg:w-2/3">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  disabled={loading}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{video.description}</p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm">
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="font-medium text-gray-700 text-xs sm:text-sm">Views</p>
                  <p className="text-sm sm:text-lg font-bold text-blue-600">{parseInt(video.statistics?.viewCount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="font-medium text-gray-700 text-xs sm:text-sm">Likes</p>
                  <p className="text-sm sm:text-lg font-bold text-green-600">{parseInt(video.statistics?.likeCount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="font-medium text-gray-700 text-xs sm:text-sm">Comments</p>
                  <p className="text-sm sm:text-lg font-bold text-purple-600">{parseInt(video.statistics?.commentCount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="font-medium text-gray-700 text-xs sm:text-sm">Privacy</p>
                  <p className="text-sm sm:text-lg font-bold text-orange-600 capitalize">{video.status?.privacyStatus}</p>
                </div>
              </div>
              
              <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                <p>Published: {formatDistanceToNow(new Date(video.publishedAt))} ago</p>
                <p className="break-all">Video ID: {video.youtubeId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
