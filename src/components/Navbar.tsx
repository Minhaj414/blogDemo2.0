import React, { useState, useRef, useEffect } from 'react';
import { User, ViewMode } from '../types';
import { Sun, Moon, PenSquare, LogOut, ChevronDown, UserCircle, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onNavigate: (view: ViewMode, postId?: string) => void;
  onSelectCategory?: (cat: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  currentView: ViewMode;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onNavigate,
  onSelectCategory,
  onOpenAuth,
  onLogout,
  isDark,
  onToggleTheme,
  currentView,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: ViewMode, category?: string) => {
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-colors bg-[#18181b]/90 border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand wordmark (single line, no decorative tags) */}
        <button
          onClick={() => onNavigate('feed')}
          className="text-2xl font-editorial font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          Blogify<span className="text-emerald-400">.</span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={() => handleNavClick('feed')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'feed' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => handleNavClick('feed', 'Engineering')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Engineering
          </button>
          <button
            onClick={() => handleNavClick('feed', 'Design')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Design
          </button>
          <button
            onClick={() => handleNavClick('feed', 'Systems')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Systems
          </button>
          <button
            onClick={() => handleNavClick('feed', 'Philosophy')}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Manifesto
          </button>
        </nav>

        {/* Zone 3: 1 primary action + theme toggle / user menu */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Pill Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-sm shadow-emerald-500/20 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Write</span>
              </button>

              {/* User Avatar Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-stone-200 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1e1e24] border border-white/10 shadow-2xl p-1.5 z-50 text-xs">
                    <div className="px-3 py-2.5 border-b border-white/5 mb-1">
                      <p className="font-semibold text-stone-100 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-emerald-400 truncate mt-0.5">{currentUser.role}</p>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
                    >
                      <PenSquare className="w-4 h-4 text-emerald-400" />
                      <span>My Workshop</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigate('feed');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-stone-300 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-stone-400" />
                      <span>Explore Feed</span>
                    </button>

                    <div className="h-px bg-white/5 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-emerald-500/20"
            >
              <UserCircle className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
