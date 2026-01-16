'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';

import ErrorMessage from '@/components/ErrorMessage';
import Loader from '@/components/Loader';
import ProtectedRoute from '@/components/ProtectedRoute';
import usePosts from '@/hooks/usePosts';
import { PostFormData } from '@/types';

function EditPostContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { 
    currentPost,
    loading, 
    error, 
    fetchPostById, 
    updatePost, 
    clearError,
    setCurrentPost 
  } = usePosts();
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    body: '',
    tags: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<Partial<PostFormData>>({});
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPost = async () => {
      const post = await fetchPostById(parseInt(id));
      if (post) {
        setFormData({
          title: post.title,
          body: post.body,
          tags: post.tags || 'Technology',
        });
      } else {
        router.push('/dashboard');
      }
      setInitialLoading(false);
    };

    loadPost();

    return () => {
      setCurrentPost(null);
    };
  }, [id, fetchPostById, router, setCurrentPost]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (validationErrors[name as keyof PostFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = (): boolean => {
    const errors: Partial<PostFormData> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must not exceed 100 characters';
    }

    if (!formData.body.trim()) {
      errors.body = 'Content is required';
    } else if (formData.body.length < 20) {
      errors.body = 'Content must be at least 20 characters';
    }

    if (!formData.tags.trim()) {
      errors.tags = 'Please select a category';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!validate()) {
      return;
    }

    const result = await updatePost(parseInt(id), formData);

    if (result.success) {
      router.push('/dashboard');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
       
        <Loader fullScreen message="Loading post..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Edit Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your post content
          </p>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} onClose={clearError} />}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div className="card">
            {/* Title */}
            <div className="mb-6">
              <label 
                htmlFor="title" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${validationErrors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your post title..."
                disabled={loading}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-slide-in">
                  {validationErrors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label 
                htmlFor="tags" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Category *
              </label>
              <select
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className={`input-field ${validationErrors.tags ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={loading}
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
              {validationErrors.tags && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-slide-in">
                  {validationErrors.tags}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <label 
                htmlFor="body" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Content *
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={12}
                className={`input-field resize-none ${validationErrors.body ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Write your post content here..."
                disabled={loading}
              />
              {validationErrors.body && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-slide-in">
                  {validationErrors.body}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {formData.body.length} characters
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader size="sm" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function EditPost() {
  return (
    <ProtectedRoute>
      <EditPostContent />
    </ProtectedRoute>
  );
}
