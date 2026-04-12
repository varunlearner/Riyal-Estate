'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, User, Building2, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, getInitials } from '@/lib/utils';

const navLinks = [
  { href: '/', label: '🏠 Home' },
  { href: '/search', label: '🔍 Search' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group hover:scale-105 transition-transform">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a5f4a] to-[#0f4538] group-hover:shadow-lg transition-all duration-300">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-[#1a5f4a]">Riyal Estate</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-all duration-300 relative',
                  pathname === link.href
                    ? 'text-[#1a5f4a]'
                    : 'text-gray-600 hover:text-[#1a5f4a]'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4a574]"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Add Property Button */}
            <Link
              href="/add-property"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#1a5f4a] to-[#0f4538] rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Link>

            {/* Saved Properties */}
            {isAuthenticated && (
              <Link
                href="/saved"
                className="hidden sm:flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
              >
                <Heart className="h-5 w-5 text-[#1a5f4a] hover:fill-[#1a5f4a]" />
              </Link>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-all duration-300">
                    <Avatar className="h-10 w-10 border border-[#1a5f4a]/20">
                      <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-[#1a5f4a]/10 to-[#d4a574]/10 text-[#1a5f4a] font-semibold">
                        {getInitials(user?.displayName || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg" align="end" forceMount>
                  <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                    <Avatar className="h-8 w-8 border border-[#1a5f4a]/20">
                      <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                      <AvatarFallback className="bg-[#1a5f4a]/10 text-[#1a5f4a]">
                        {getInitials(user?.displayName || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer text-gray-700 hover:text-[#1a5f4a] hover:bg-gray-50 transition-all">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/saved" className="cursor-pointer text-gray-700 hover:text-[#1a5f4a] hover:bg-gray-50 transition-all">
                      <Heart className="mr-2 h-4 w-4" />
                      Saved Properties
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/properties" className="cursor-pointer text-gray-700 hover:text-[#1a5f4a] hover:bg-gray-50 transition-all">
                      <Building2 className="mr-2 h-4 w-4" />
                      My Listings
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer text-gray-700 hover:text-[#1a5f4a] hover:bg-gray-50 transition-all">
                        <User className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 transition-all">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" className="hidden sm:flex border-[#1a5f4a] text-[#1a5f4a] hover:bg-[#1a5f4a]/5 rounded-lg">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="hidden sm:flex bg-gradient-to-r from-[#1a5f4a] to-[#0f4538] text-white hover:shadow-lg rounded-lg transition-all duration-300 hover:scale-105">
                    Create Account
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-all text-[#1a5f4a]"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 bg-gray-50">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300',
                    pathname === link.href
                      ? 'text-[#1a5f4a] border-l-4 border-[#d4a574] bg-gray-100'
                      : 'text-gray-600 hover:text-[#1a5f4a] hover:bg-gray-100'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/add-property"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#1a5f4a] to-[#0f4538] rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Property
              </Link>
              {!isAuthenticated && (
                <div className="flex gap-2 px-4 pt-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full border-[#1a5f4a] text-[#1a5f4a] hover:bg-[#1a5f4a]/5">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full bg-[#1a5f4a] text-white hover:bg-[#0f4538]">Register</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}