import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

function SignUpPage() {
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await signup(firstName, lastName, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
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
      setError(err.response?.data?.message || 'Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center my-20 items-center flex-col'>
      <div className='w-full max-w-md p-8 bg-white shadow-md rounded-lg border border-gray-200'>
        <h2 className='text-2xl font-bold text-center mb-6'>Create an Account</h2>
        
        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm'>
            {error}
          </div>
        )}

        {/* Google Sign-Up first */}
        <div className='flex justify-center mb-4'>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-up failed')}
            theme="outline"
            size="large"
            width="100%"
            text="signup_with"
          />
        </div>

        {/* Divider */}
        <div className='flex items-center my-4'>
          <div className='flex-1 border-t border-gray-300'></div>
          <span className='px-3 text-sm text-gray-500'>or sign up with email</span>
          <div className='flex-1 border-t border-gray-300'></div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>First Name</label>
              <Input 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='John'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Last Name</label>
              <Input 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Doe'
              />
            </div>
          </div>
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
              placeholder='Create a password'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Confirm Password</label>
            <Input 
              type='password' 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm your password'
            />
          </div>
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? <Loader2 className='animate-spin h-4 w-4 mr-2' /> : null}
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className='mt-6 text-center text-sm'>
          Already have an account?{' '}
          <Link to="/auth/sign-in" className='text-primary font-medium hover:underline'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
