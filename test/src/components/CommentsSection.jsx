import { useState, useEffect } from 'react';
import { videoAPI } from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const CommentsSection = ({ video }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (video?.youtubeId) {
      fetchComments();
    }
  }, [video]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await videoAPI.getComments(video.youtubeId);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setAddingComment(true);
    try {
      const response = await videoAPI.addComment(video.youtubeId, newComment.trim());
      if (response.data.success) {
        setNewComment('');
        toast.success('Comment added successfully!');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  const handleReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text?.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setReplyingTo(commentId);
    try {
      const response = await videoAPI.replyToComment(video.youtubeId, commentId, text.trim());
      if (response.data.success) {
        setReplyText({ ...replyText, [commentId]: '' });
        toast.success('Reply added successfully!');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error replying to comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add reply');
    } finally {
      setReplyingTo(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await videoAPI.deleteComment(video.youtubeId, commentId);
      if (response.data.success) {
        toast.success('Comment deleted successfully!');
        fetchComments(); // Refresh comments
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (!video) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Comments</h3>

      {/* Add new comment */}
      <form onSubmit={handleAddComment} className="mb-4 sm:mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-sm sm:text-base"
          disabled={addingComment}
        />
        <button
          type="submit"
          disabled={addingComment || !newComment.trim()}
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {addingComment ? 'Adding...' : 'Add Comment'}
        </button>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              {/* Main comment */}
              <div className="flex items-start space-x-2 sm:space-x-3">
                <img
                  src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl}
                  alt={comment.snippet.topLevelComment.snippet.authorDisplayName}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                    <span className="font-medium text-gray-800 text-sm sm:text-base truncate">
                      {comment.snippet.topLevelComment.snippet.authorDisplayName}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.snippet.topLevelComment.snippet.publishedAt))} ago
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base break-words">
                    {comment.snippet.topLevelComment.snippet.textDisplay}
                  </p>
                  
                  {/* Comment actions */}
                  <div className="flex items-center space-x-3 sm:space-x-4 mt-2">
                    <button
                      onClick={() => {
                        const newReplyText = { ...replyText };
                        if (newReplyText[comment.snippet.topLevelComment.id]) {
                          delete newReplyText[comment.snippet.topLevelComment.id];
                        } else {
                          newReplyText[comment.snippet.topLevelComment.id] = '';
                        }
                        setReplyText(newReplyText);
                      }}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.snippet.topLevelComment.id)}
                      className="text-xs sm:text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Reply form */}
                  {replyText[comment.snippet.topLevelComment.id] !== undefined && (
                    <div className="mt-3">
                      <textarea
                        value={replyText[comment.snippet.topLevelComment.id]}
                        onChange={(e) => setReplyText({
                          ...replyText,
                          [comment.snippet.topLevelComment.id]: e.target.value
                        })}
                        placeholder="Write a reply..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-sm"
                        disabled={replyingTo === comment.snippet.topLevelComment.id}
                      />
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleReply(comment.snippet.topLevelComment.id)}
                          disabled={replyingTo === comment.snippet.topLevelComment.id}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          {replyingTo === comment.snippet.topLevelComment.id ? 'Replying...' : 'Reply'}
                        </button>
                        <button
                          onClick={() => {
                            const newReplyText = { ...replyText };
                            delete newReplyText[comment.snippet.topLevelComment.id];
                            setReplyText(newReplyText);
                          }}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-xs sm:text-sm hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.comments && (
                <div className="ml-8 sm:ml-11 mt-4 space-y-3">
                  {comment.replies.comments.map((reply) => (
                    <div key={reply.id} className="flex items-start space-x-2 sm:space-x-3">
                      <img
                        src={reply.snippet.authorProfileImageUrl}
                        alt={reply.snippet.authorDisplayName}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                          <span className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                            {reply.snippet.authorDisplayName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(reply.snippet.publishedAt))} ago
                          </span>
                        </div>
                        <p className="text-gray-700 text-xs sm:text-sm whitespace-pre-wrap break-words">
                          {reply.snippet.textDisplay}
                        </p>
                        <button
                          onClick={() => handleDeleteComment(reply.id)}
                          className="text-xs text-red-600 hover:text-red-800 mt-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
