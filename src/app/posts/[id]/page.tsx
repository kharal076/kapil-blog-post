'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag, Edit2, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';
import ErrorMessage from '@/components/ErrorMessage';
import ProtectedRoute from '@/components/ProtectedRoute';
import usePosts from '@/hooks/usePosts';
import useAuth from '@/hooks/useAuth';

function PostDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const { user } = useAuth();
  const {
    currentPost,
    loading,
    error,
    fetchPostById,
    deletePost,
    clearError,
    setCurrentPost,
  } = usePosts();

  useEffect(() => {
    fetchPostById(parseInt(id));

    return () => {
      setCurrentPost(null);
    };
  }, [id, fetchPostById, setCurrentPost]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEdit = () => {
    router.push(`/posts/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(parseInt(id));
      if (result.success) {
        router.push('/dashboard');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <Loader fullScreen message="Loading post..." />
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage 
            message={error || 'Post not found'} 
            onClose={() => router.push('/dashboard')} 
          />
          <div className="text-center py-12">
            <Link 
              href="/dashboard"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isAuthor = user && currentPost.author?.id === user.id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 group animate-slide-in"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Post Content */}
        <article className="card animate-fade-in">
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white flex-1 text-balance">
                {currentPost.title}
              </h1>
              
              {isAuthor && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handleEdit}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                    title="Edit post"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all"
                    title="Delete post"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{currentPost.author?.name || 'Unknown Author'}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(currentPost.createdAt)}</span>
              </div>

              {currentPost.tags && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span className="badge">
                    {currentPost.tags}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {currentPost.body}
            </div>
          </div>
        </article>

        {/* Author Info */}
        <div className="card mt-6 animate-slide-in" style={{ animationDelay: '100ms' }}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            About the Author
          </h3>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
              {currentPost.author?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {currentPost.author?.name || 'Unknown Author'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Content Creator
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PostDetail() {
  return (
    <ProtectedRoute>
      <PostDetailContent />
    </ProtectedRoute>
  );
}
