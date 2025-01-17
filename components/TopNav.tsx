'use client';

import Link from 'next/link';
import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';

import { UserContext } from '../contexts/UserContext.tsx';

const TopNav: React.FC = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useRouter();

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('userInfo');
    router.push('/');
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 
              className="text-white font-bold text-lg hover:cursor-pointer"
              onClick={() => router.push('/')}
            >Records</h1>
          </div>
          {currentUser ? (
            <div className="flex space-x-4 items-center">
              <span>Signed in as: {currentUser.name}</span>
              <span className="flex" onClick={logout}>
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sign Out</button>
              </span>
            </div>
          ) : (
            <div className="flex space-x-4 items-center">
              <Link 
                className="flex items-center"
                href="/signup"
              >
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</button>
              </Link>
              <Link 
                className="flex items-center"
                href="/login"
              >
                <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
