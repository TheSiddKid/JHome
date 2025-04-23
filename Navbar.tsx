import React from 'react';
import { Stethoscope, Zap } from 'lucide-react';
import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <nav className="w-full z-50 border-b border-purple-500/20 bg-purple-950/30 backdrop-blur-lg fixed top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Name */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            
            <Stethoscope className="h-6 w-6 text-purple-400" />

            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              MediMate
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Services
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
              Privacy
            </Link>
          </div>

        

          {/* TODO: Add Mobile Menu Button and Drawer/Panel for smaller screens if needed */}

        </div>
      </div>
      {/* TODO: Add Mobile Menu Panel here */}
    </nav>
  );
};

export default Navbar;
