'use client'

import axios from 'axios';

import React, { useContext, useState, FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { UserContext } from '../../contexts/UserContext';

import { signup } from '../../utils/server.ts';

const Signup: React.FC = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ email, setEmail ] = useState<string>('');
  const [ name, setName ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ username, setUsername ] = useState<string>('');
  const [ error, setError ] = useState<string>('');

  const handleSignUp = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setError('');
      const signupData = { email, name, password, username };
      const res = await signup(signupData);
      const userInfo = res.data;
      if (userInfo) {
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        setCurrentUser(userInfo);
        router.push('/');
      }
    } catch (error: any) {
      setError(error);
      console.log(error);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-center items-start h-screen">
        <div className="bg-gray-700 p-8 rounded-md shadow-md">
          <h1 className="text-2xl mb-4">Signup</h1>
          {error &&
            <div className="mb-4 p-4 bg-red-300 text-red-900 rounded border-red-900">
              {error.message}
            </div>
          }
          <input
            type="text"
            placeholder="Email"
            className="form-input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Full Name"
            className="form-input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="form-input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded focus:outline-none focus:ring"
            onClick={handleSignUp}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  )
};

export default Signup
