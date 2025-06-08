import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { FaGoogle, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'wouter';

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    agreeToTerms: false
  });

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Redirect to="/" />;
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLogin = (provider: string) => {
    // This would integrate with your chosen auth provider
    console.log(`Login with ${provider}`);
    // For now, redirect to a placeholder endpoint
    window.location.href = `/api/auth/${provider}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Hero Section */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Transform Your Business with 
              <span className="text-primary"> Custom Automation</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of businesses that have reduced costs by up to 70% and improved efficiency 
              with our cutting-edge automation solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {[
              { icon: <CheckCircle className="w-6 h-6 text-primary" />, text: "Custom business automation solutions" },
              { icon: <CheckCircle className="w-6 h-6 text-primary" />, text: "Reduce operational costs by up to 70%" },
              { icon: <CheckCircle className="w-6 h-6 text-primary" />, text: "Free lifetime hosting and 1-year support" },
              { icon: <CheckCircle className="w-6 h-6 text-primary" />, text: "24/7 technical assistance" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                {feature.icon}
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12"
        >
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started Today'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Sign in to access your automation dashboard'
                : 'Create your account and transform your business'
              }
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 rounded-lg py-3 px-4 text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
              <span>Continue with Google</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin('facebook')}
                className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 rounded-lg py-3 px-4 text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <FaFacebookF className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </button>
              
              <button
                onClick={() => handleSocialLogin('linkedin')}
                className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 rounded-lg py-3 px-4 text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <FaLinkedinIn className="w-4 h-4 text-blue-700" />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Auth Method Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                authMethod === 'email'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                authMethod === 'phone'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Phone</span>
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                      placeholder="John"
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                      placeholder="Doe"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isLogin && (
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                  placeholder="Your Company"
                />
              </div>
            )}

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <input
                type={authMethod === 'email' ? 'email' : 'tel'}
                id="contact"
                value={authMethod === 'email' ? formData.email : formData.phone}
                onChange={(e) => handleInputChange(authMethod, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                placeholder={authMethod === 'email' ? 'john@company.com' : '+1 (555) 123-4567'}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary/50"
                  required={!isLogin}
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                </label>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot your password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </form>

          {/* Auth Switch */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium hover:underline focus:outline-none"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}