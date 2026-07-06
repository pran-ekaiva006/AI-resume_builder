import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isSignedIn = !!user;
  const isHomePage = location.pathname === '/';

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

  // Scroll to a section on the home page, or navigate there first
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (isHomePage) {
      // Already on home — just smooth-scroll
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to home with hash — the home page effect will scroll on mount
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#10131C]/95 backdrop-blur-xl border-b border-white/10 text-text-on-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left: Logo/Icon + Brand Name */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-brass p-2 rounded-xl group-hover:bg-brass/90 transition-colors duration-150">
              <FileText className="h-6 w-6 text-text-on-light" />
            </div>
            <span className="text-xl font-display font-bold text-text-on-dark tracking-tight">
              AI Resume Builder
            </span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="text-text-on-dark hover:text-brass transition-colors duration-150 font-body text-sm font-medium">
              Features
            </a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className="text-text-on-dark hover:text-brass transition-colors duration-150 font-body text-sm font-medium">
              How it Works
            </a>
          </nav>

          {/* Right: Auth buttons */}
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="rounded-full px-4 py-2 text-sm border-brass text-brass bg-transparent hover:bg-brass hover:text-text-on-light transition-all duration-150 focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-ink"
                >
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-9 h-9 rounded-full bg-teal text-text-on-light font-semibold text-sm cursor-pointer hover:bg-teal/80 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-ink">
                    {getInitials()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-surface text-text-on-dark border-white/10 shadow-xl">
                  <DropdownMenuLabel>
                    <div className="flex flex-col text-text-on-dark">
                      <span className="text-sm font-body font-medium">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-xs font-body text-text-on-dark/70 truncate">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer font-body text-text-on-dark hover:bg-white/5 focus:bg-white/5 transition-all duration-150">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer font-body text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 focus:text-red-400 transition-all duration-150">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/auth/sign-in">
              <Button className="bg-brass hover:bg-brass/90 text-text-on-light font-body font-medium px-5 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-ink">
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
