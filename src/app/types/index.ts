// User types
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

// Post types
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  author?: {
    id: number;
    name: string;
  };
  createdAt: string;
  tags?: string;
}

export interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  setPosts: (posts: Post[]) => void;
  setCurrentPost: (post: Post | null) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (postId: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Theme types
export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PostFormData {
  title: string;
  body: string;
  tags: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Hook return types
export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<User>>;
  register: (name: string, email: string, password: string) => Promise<ApiResponse<User>>;
  logout: () => void;
  checkAuth: () => boolean;
  updateUser: (user: User) => void;
}

export interface UsePostsReturn {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  fetchPosts: (page?: number, limit?: number) => Promise<void>;
  fetchPostById: (postId: number) => Promise<Post | null>;
  createPost: (postData: PostFormData) => Promise<ApiResponse<Post>>;
  updatePost: (postId: number, postData: PostFormData) => Promise<ApiResponse<Post>>;
  deletePost: (postId: number) => Promise<ApiResponse<void>>;
  searchPosts: (query: string) => Post[];
  filterByTag: (tag: string) => Post[];
  clearError: () => void;
  setCurrentPost: (post: Post | null) => void;
}
