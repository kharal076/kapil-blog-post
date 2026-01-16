import { Edit2, Trash2, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  showActions?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onDelete, 
  onEdit, 
  showActions = true 
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const truncateText = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="card group hover:scale-[1.01] transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link 
            href={`/posts/${post.id}`}
            className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors block mb-2"
          >
            {post.title}
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author?.name || 'Unknown Author'}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            
            {post.tags && (
              <div className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span className="badge text-xs">
                  {post.tags}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(post.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all"
              title="Edit post"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onDelete(post.id)}
              className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {truncateText(post.body)}
      </p>
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link 
          href={`/posts/${post.id}`}
          className="link text-sm font-medium inline-flex items-center group/link"
        >
          Read more 
          <span className="ml-1 group-hover/link:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
