import { useState, useEffect } from 'react';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const NotesSection = ({ video }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium'
  });

  useEffect(() => {
    if (video?.youtubeId) {
      fetchNotes();
    }
  }, [video]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await notesAPI.getNotes(video.youtubeId);
      if (response.data.success) {
        setNotes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      let response;
      if (editingNote) {
        response = await notesAPI.updateNote(editingNote._id, formData);
      } else {
        response = await notesAPI.createNote({
          ...formData,
          videoId: video.youtubeId
        });
      }

      if (response.data.success) {
        setFormData({ title: '', content: '', category: 'general', priority: 'medium' });
        setShowForm(false);
        setEditingNote(null);
        fetchNotes();
        toast.success(editingNote ? 'Note updated successfully!' : 'Note created successfully!');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(error.response?.data?.message || 'Failed to save note');
    }
  };

  const handleEdit = (note) => {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority
    });
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await notesAPI.deleteNote(noteId);
      if (response.data.success) {
        fetchNotes();
        toast.success('Note deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error(error.response?.data?.message || 'Failed to delete note');
    }
  };

  const cancelForm = () => {
    setFormData({ title: '', content: '', category: 'general', priority: 'medium' });
    setShowForm(false);
    setEditingNote(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'improvement': return 'bg-blue-100 text-blue-800';
      case 'ideas': return 'bg-purple-100 text-purple-800';
      case 'feedback': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!video) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
        <h3 className="text-lg font-bold text-gray-800">Notes</h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm self-start"
        >
          Add Note
        </button>
      </div>

      {/* Note Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <h4 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">
            {editingNote ? 'Edit Note' : 'Add New Note'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                placeholder="Enter note title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                placeholder="Enter your ideas and notes here..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                >
                  <option value="general">General</option>
                  <option value="improvement">Improvement</option>
                  <option value="ideas">Ideas</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                {editingNote ? 'Update Note' : 'Save Note'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No notes yet. Add your first note to start organizing your video improvement ideas!
        </p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0">
                <h4 className="font-medium text-gray-800 text-sm sm:text-base break-words">{note.title}</h4>
                <div className="flex gap-2 self-start">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-600 hover:text-red-800 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3 whitespace-pre-wrap text-sm sm:text-base break-words">{note.content}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                    {note.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
                    {note.priority} priority
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(note.createdAt))} ago
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesSection;
