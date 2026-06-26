import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

function SignInpage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center my-20 items-center flex-col'>
      <div className='w-full max-w-md p-8 bg-white shadow-md rounded-lg border border-gray-200'>
        <h2 className='text-2xl font-bold text-center mb-6'>Sign In to Resume Builder</h2>
        
        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Email</label>
            <Input 
              type='email' 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Password</label>
            <Input 
              type='password' 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
            />
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? <Loader2 className='animate-spin h-4 w-4 mr-2' /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className='flex items-center my-6'>
          <div className='flex-1 border-t border-gray-300'></div>
          <span className='px-3 text-sm text-gray-500'>or continue with</span>
          <div className='flex-1 border-t border-gray-300'></div>
        </div>

        {/* Google Sign-In */}
        <div className='flex justify-center'>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-in failed')}
            theme="outline"
            size="large"
            width="100%"
            text="signin_with"
          />
        </div>

        <div className='mt-6 text-center space-y-2 text-sm'>
          <div>
            <Link to="/auth/forgot-password" className='text-primary hover:underline'>
              Forgot password?
            </Link>
          </div>
          <div>
            Don't have an account?{' '}
            <Link to="/auth/sign-up" className='text-primary font-medium hover:underline'>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInpage;