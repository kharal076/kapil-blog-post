import { useEffect, useState } from 'react';
import { useNavigate } from 'next/navigation';
import { Search, Plus, Filter } from 'lucide-react';

import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import usePosts from '../hooks/usePosts';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    posts,
    loading,
    error,
    fetchPosts,
    deletePost,
    clearError,
    searchPosts,
    filterByTag,
  } = usePosts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    let result = posts;

    if (searchQuery.trim()) {
      result = searchPosts(searchQuery);
    }

    if (selectedTag) {
      result = result.filter(post => post.tags === selectedTag);
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedTag, searchPosts]);

  const handleEdit = (postId) => {
    navigate(`/posts/edit/${postId}`);
  };

  const handleDeleteClick = (postId) => {
    setDeleteConfirm(postId);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      const result = await deletePost(deleteConfirm);
      if (result.success) {
        setDeleteConfirm(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const availableTags = [...new Set(posts.map(post => post.tags).filter(Boolean))];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your blog posts
            </p>
          </div>
          
          <button
            onClick={() => navigate('/posts/create')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Post</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="input-field pl-10 appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {availableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {(searchQuery || selectedTag) && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag('');
                }}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Posts Grid */}
        {loading ? (
          <Loader message="Loading posts..." />
        ) : filteredPosts.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || selectedTag
                ? 'Try adjusting your search or filters'
                : "You haven't created any posts yet"}
            </p>
            {!searchQuery && !selectedTag && (
              <button
                onClick={() => navigate('/posts/create')}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Post</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Delete Post
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
