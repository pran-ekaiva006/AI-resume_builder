import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:5001'}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setMessage('Password has been reset. You can now sign in.');
        setTimeout(() => navigate('/auth/sign-in'), 2000);
      } else {
        setMessage(data.message || 'Error resetting password.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center my-20 items-center flex-col'>
      <h2 className='text-2xl font-bold mb-4'>Reset Password</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-80'>
        <input 
          type="password" 
          placeholder="Enter new password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500'
          required
          minLength={6}
        />
        <button disabled={loading} type="submit" className='bg-blue-500 text-white p-2 rounded disabled:bg-blue-300'>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className={`mt-4 text-center max-w-xs ${success ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
      <Link to="/auth/sign-in" className='mt-4 text-sm text-blue-500 hover:underline'>Back to Sign In</Link>
    </div>
  );
}

export default ResetPassword;
