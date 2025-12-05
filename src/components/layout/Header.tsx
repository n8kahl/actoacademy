'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Search,
  Menu,
  X,
  BookOpen,
  Award,
  FileText,
  Video,
  LayoutDashboard,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Certifications', href: '/certifications', icon: Award },
  { name: 'Resources', href: '/resources', icon: FileText },
  { name: 'Videos', href: '/videos', icon: Video },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'internal'>('customer');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-acto-teal flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-acto-black tracking-tight">ACTO Academy</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Training Platform</p>
            </div>
          </Link>

          {/* Portal Toggle - Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setUserType('customer')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                userType === 'customer'
                  ? 'bg-acto-teal text-white shadow-sm'
                  : 'text-gray-500 hover:text-acto-black'
              }`}
            >
              Customer Portal
            </button>
            <button
              onClick={() => setUserType('internal')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                userType === 'internal'
                  ? 'bg-acto-teal text-white shadow-sm'
                  : 'text-gray-500 hover:text-acto-black'
              }`}
            >
              Internal Portal
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search - Desktop */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="bg-transparent text-sm text-acto-black placeholder:text-gray-400 outline-none w-40"
              />
            </div>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-acto-black">Welcome back</p>
                <p className="text-xs text-gray-500">Bronze Certified</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-acto-teal flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-acto-black" />
              ) : (
                <Menu className="w-5 h-5 text-acto-black" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden md:block border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-acto-teal border-b-2 border-transparent hover:border-acto-teal transition-all"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {/* Portal Toggle - Mobile */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
              <button
                onClick={() => setUserType('customer')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  userType === 'customer'
                    ? 'bg-acto-teal text-white'
                    : 'text-gray-500'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setUserType('internal')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  userType === 'internal'
                    ? 'bg-acto-teal text-white'
                    : 'text-gray-500'
                }`}
              >
                Internal
              </button>
            </div>

            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-acto-soft-blue hover:text-acto-dark-blue transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
