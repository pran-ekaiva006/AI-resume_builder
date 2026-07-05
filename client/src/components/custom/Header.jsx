import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { FileText, ArrowRight, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isSignedIn = !!user;

  // Build initials from firstName/lastName (or fallback to email initial)
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-ink/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left: Logo/Icon + Brand Name */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-brass p-2 rounded-xl group-hover:bg-brass/90 transition-colors">
              <FileText className="h-6 w-6 text-ink" />
            </div>
            <span className="text-xl font-display font-bold text-text-on-dark tracking-tight">
              AI Resume Builder
            </span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-text-on-dark/70 hover:text-brass transition-colors font-body text-sm font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-text-on-dark/70 hover:text-brass transition-colors font-body text-sm font-medium">
              How it Works
            </a>
          </nav>

          {/* Right: Auth buttons */}
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="rounded-full px-4 py-2 text-sm border-white/20 text-text-on-dark hover:bg-white/10 hover:text-white transition focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-ink"
                >
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-9 h-9 rounded-full bg-teal text-ink font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-ink">
                    {getInitials()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/auth/sign-in">
              <Button className="bg-brass hover:brightness-110 text-ink font-medium px-5 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
