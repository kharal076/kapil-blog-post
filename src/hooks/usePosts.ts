'use client';

import { useCallback } from 'react';
import usePostsStore from '@/store/postsStore';
import useAuthStore from '@/store/authStore';
import api from '@/utils/apiService';
import { UsePostsReturn, Post, PostFormData, ApiResponse } from '@/types';

const usePosts = (): UsePostsReturn => {
  const { 
    posts, 
    currentPost,
    loading, 
    error,
    setPosts,
    setCurrentPost,
    addPost,
    updatePost: updatePostStore,
    deletePost: deletePostStore,
    setLoading,
    setError,
    clearError,
  } = usePostsStore();

  const { user } = useAuthStore();

  // Fetch all posts
  const fetchPosts = useCallback(async (page: number = 1, limit: number = 10): Promise<void> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await api.get<Post[]>('/posts', {
        params: { _page: page, _limit: limit }
      });
      
      // Add mock author info and additional fields
      const postsWithAuthors: Post[] = response.data.map(post => ({
        ...post,
        author: {
          id: post.userId,
          name: `User ${post.userId}`,
        },
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        tags: ['Technology', 'Programming', 'Web Development'][Math.floor(Math.random() * 3)],
      }));
      
      setPosts(postsWithAuthors);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [setPosts, setLoading, setError, clearError]);

  // Fetch single post by ID
  const fetchPostById = useCallback(async (postId: number): Promise<Post | null> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await api.get<Post>(`/posts/${postId}`);
      const post: Post = {
        ...response.data,
        author: {
          id: response.data.userId,
          name: `User ${response.data.userId}`,
        },
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        tags: 'Technology',
      };
      
      setCurrentPost(post);
      return post;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch post');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setCurrentPost, setLoading, setError, clearError]);

  // Create new post
  const createPost = useCallback(async (postData: PostFormData): Promise<ApiResponse<Post>> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await api.post<Post>('/posts', {
        ...postData,
        userId: user?.id || 1,
      });
      
      // Add additional fields to match our format
      const newPost: Post = {
        ...response.data,
        id: Date.now(), // JSONPlaceholder returns id: 101, we use timestamp for uniqueness
        userId: user?.id || 1,
        author: {
          id: user?.id || 1,
          name: user?.name || 'Current User',
        },
        createdAt: new Date().toISOString(),
        tags: postData.tags || 'General',
      };
      
      addPost(newPost);
      return { success: true, data: newPost };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create post';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [user, addPost, setLoading, setError, clearError]);

  // Update existing post
  const updatePost = useCallback(async (
    postId: number, 
    postData: PostFormData
  ): Promise<ApiResponse<Post>> => {
    setLoading(true);
    clearError();
    
    try {
      const response = await api.put<Post>(`/posts/${postId}`, {
        ...postData,
        userId: user?.id || 1,
      });
      
      const updatedPost: Post = {
        ...response.data,
        id: postId,
        userId: user?.id || 1,
        author: {
          id: user?.id || 1,
          name: user?.name || 'Current User',
        },
        createdAt: posts.find(p => p.id === postId)?.createdAt || new Date().toISOString(),
        tags: postData.tags || 'General',
      };
      
      updatePostStore(updatedPost);
      return { success: true, data: updatedPost };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update post';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [user, posts, updatePostStore, setLoading, setError, clearError]);

  // Delete post
  const deletePost = useCallback(async (postId: number): Promise<ApiResponse<void>> => {
    setLoading(true);
    clearError();
    
    try {
      await api.delete(`/posts/${postId}`);
      deletePostStore(postId);
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete post';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [deletePostStore, setLoading, setError, clearError]);

  // Search posts
  const searchPosts = useCallback((query: string): Post[] => {
    if (!query.trim()) {
      return posts;
    }
    
    const lowercaseQuery = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.body.toLowerCase().includes(lowercaseQuery)
    );
  }, [posts]);

  // Filter posts by tag
  const filterByTag = useCallback((tag: string): Post[] => {
    if (!tag) {
      return posts;
    }
    
    return posts.filter(post => post.tags === tag);
  }, [posts]);

  return {
    posts,
    currentPost,
    loading,
    error,
    fetchPosts,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    filterByTag,
    clearError,
    setCurrentPost,
  };
};

export default usePosts;
