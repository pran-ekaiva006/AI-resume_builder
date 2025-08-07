import React from 'react'
import { Link } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

function Header() {
  const { isSignedIn } = useUser()

  return (
    <header className="bg-white shadow-sm px-6 py-4 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Left: Logo and Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-bold text-gray-900">
            SmartCV
          </span>
        </Link>

        {/* Right: Auth buttons */}
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="rounded-full px-4 py-2 text-sm hover:bg-gray-100 transition"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <Link to="/auth/sign-in">
            <Button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-5 py-2 rounded-full shadow-md flex items-center gap-2 transition-all duration-200"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header