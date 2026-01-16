import { create } from 'zustand';
import { PostsState, Post } from '@/types';

const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  
  setPosts: (posts: Post[]) => set({ posts }),
  
  setCurrentPost: (post: Post | null) => set({ currentPost: post }),
  
  addPost: (post: Post) => set((state) => ({ 
    posts: [post, ...state.posts] 
  })),
  
  updatePost: (updatedPost: Post) => set((state) => ({
    posts: state.posts.map((post) => 
      post.id === updatedPost.id ? updatedPost : post
    ),
  })),
  
  deletePost: (postId: number) => set((state) => ({
    posts: state.posts.filter((post) => post.id !== postId),
  })),
  
  setLoading: (loading: boolean) => set({ loading }),
  
  setError: (error: string | null) => set({ error }),
  
  clearError: () => set({ error: null }),
}));

export default usePostsStore;
