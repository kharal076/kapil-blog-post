'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Mail, Search, Plus, Filter } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import Loader from '@/components/Loader';
import usePosts from '@/hooks/usePosts';
import PostCard from '@/components/PostCard';
import ErrorMessage from '@/components/ErrorMessage';
import { Post } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  const {
    posts,
    loading,
    error,
    fetchPosts,
    deletePost,
    clearError,
    searchPosts,
  } = usePosts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, router]);

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Search & filter
  useEffect(() => {
    let result = posts;

    if (searchQuery.trim()) {
      result = searchPosts(searchQuery);
    }

    if (selectedTag) {
      result = result.filter((post) =>
        Array.isArray(post.tags) && post.tags.includes(selectedTag)
      );
    }

    setFilteredPosts(result);
  }, [posts, searchQuery, selectedTag, searchPosts]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleEdit = (postId: number) => {
    router.push(`/posts/edit/${postId}`);
  };

  const handleDeleteClick = (postId: number) => {
    setDeleteConfirm(postId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const result = await deletePost(deleteConfirm);
    if (result.success) {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  // Flatten tag arrays
  const availableTags = Array.from(
    new Set(posts.flatMap((post: Post) => post.tags || []))
  );

  if (isChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 w-full max-w-full overflow-x-hidden px-2 py-4 md:px-6 md:py-4 lg:px-8 lg:py-6">
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your blog posts and profile
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* User Info */}
        <div className="card max-w-full">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Profile Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-white font-medium">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Dashboard */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
            <button
              onClick={() => router.push('/posts/create')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Post</span>
            </button>
          </div>

          {/* Search & Filter */}
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
              <div className="sm:w-48 relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="input-field pl-10 appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {availableTags.map(tag => (
                    <option key={tag as string} value={tag as string}>{tag as string}</option>
                  ))}
                </select>
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
                  onClick={() => router.push('/posts/create')}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Post</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPosts.map(post => (
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
                <button onClick={handleDeleteCancel} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} className="btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
