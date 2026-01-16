import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', fullScreen = false, message = 'Loading...' }) => {
  const sizeClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10';

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className={`${sizeClass} animate-spin text-primary-600`} />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default Loader;
