import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App.jsx";

import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInpage from './auth/sign-in/index.jsx';
import Home from './assets/home/index.jsx';
import Dashboard from './dashboard/index.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import EditResume from './dashboard/resume/[resumeId]/edit/index.jsx';



const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
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
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
   <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
   <RouterProvider router={router} />

   </ClerkProvider>


    </React.StrictMode>,
)
