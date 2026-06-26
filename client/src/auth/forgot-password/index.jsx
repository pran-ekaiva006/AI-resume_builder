import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      setMessage(data.message || 'If that email is registered, a reset link has been sent.');
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center my-20 items-center flex-col'>
      <h2 className='text-2xl font-bold mb-4'>Forgot Password</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-80'>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500'
          required
        />
        <button disabled={loading} type="submit" className='bg-blue-500 text-white p-2 rounded disabled:bg-blue-300'>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {message && <p className='mt-4 text-green-600 text-center max-w-xs'>{message}</p>}
      <Link to="/auth/sign-in" className='mt-4 text-sm text-blue-500 hover:underline'>Back to Sign In</Link>
    </div>
  );
}

export default ForgotPassword;
