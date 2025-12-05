'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Search,
  Menu,
  X,
  Bell,
  ChevronDown,
} from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'internal'>('customer');

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-acto-teal to-acto-dark-blue flex items-center justify-center shadow-lg shadow-acto-teal/20 group-hover:shadow-acto-teal/30 transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-acto-black tracking-tight">
                ACTO <span className="text-acto-teal">Academy</span>
              </h1>
            </div>
          </Link>

          {/* Center - Portal Toggle */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-100/80 rounded-full p-1">
              <button
                onClick={() => setUserType('customer')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  userType === 'customer'
                    ? 'bg-white text-acto-black shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setUserType('internal')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  userType === 'internal'
                    ? 'bg-white text-acto-black shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Internal
              </button>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100/80 hover:bg-gray-200/80 rounded-full text-sm text-gray-500 transition-colors">
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-white rounded text-[10px] text-gray-400 font-mono">
                &#x2318;K
              </kbd>
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-acto-teal rounded-full" />
            </button>

            {/* User */}
            <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-acto-teal to-acto-dark-blue flex items-center justify-center text-white text-sm font-medium">
                NK
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Search - Mobile */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Portal Toggle - Mobile */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setUserType('customer')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  userType === 'customer'
                    ? 'bg-white text-acto-black shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Customer Portal
              </button>
              <button
                onClick={() => setUserType('internal')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  userType === 'internal'
                    ? 'bg-white text-acto-black shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                Internal Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
