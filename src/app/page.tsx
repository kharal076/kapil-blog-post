import Link from 'next/link';
import { PenSquare, Users, Zap, Shield } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: PenSquare,
      title: 'Easy Writing',
      description: 'Create beautiful blog posts with our intuitive editor',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with other writers and readers',
    },
    {
      icon: Zap,
      title: 'Fast & Responsive',
      description: 'Lightning-fast performance on all devices',
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Your data is safe with modern security practices',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Share Your Stories
            <span className="block text-primary-600 dark:text-primary-400 mt-2">
              With the World
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Create, publish, and manage your blog posts effortlessly. Join our community of writers today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="btn-primary text-lg px-8 py-3"
            >
              Get Started Free
            </Link>
            
            <Link
              href="/login"
              className="btn-secondary text-lg px-8 py-3"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose BlogPlatform?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to create and manage your blog
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
                <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-white/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="card bg-linear-to-r from-primary-600 to-blue-600 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Writing?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of writers sharing their stories
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2026 BlogPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;