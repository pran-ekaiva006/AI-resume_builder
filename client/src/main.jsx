import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App.jsx";

import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInpage from './auth/sign-in/index.jsx';
import Home from './assets/home/index.jsx';
import Dashboard from './dashboard/index.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import EditResume from './dashboard/resume/[resumeId]/edit/index.jsx';
import ViewResume from './my-resume/[resumeId]/view/index.jsx';
import ForgotPassword from './auth/forgot-password/index.jsx';
import ResetPassword from './auth/reset-password/index.jsx';
import SignUpPage from './auth/sign-up/index.jsx';
import PublicResumeView from './my-resume/[resumeId]/public/index.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const router=createBrowserRouter([
  {

element:<App/>,
children:[
  
  {
    path:'/dashboard',
    element:<Dashboard/>

  },
  {
    path:'/dashboard/resume/:resumeId/edit',
    element:<EditResume/>
  }
]
  },
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/auth/sign-in',
    element:<SignInpage/>
  },
  {
    path:'/auth/sign-up',
    element:<SignUpPage/>
  },
  {
    path:'/auth/forgot-password',
    element:<ForgotPassword/>
  },
  {
    path:'/auth/reset-password/:token',
    element:<ResetPassword/>
  },
  {
    path:'/my-resume/:resumeId/view',
    element:<ViewResume/>
  },
  {
    path:'/resume/:resumeId/public',
    element:<PublicResumeView/>
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
