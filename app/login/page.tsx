'use client';

import axios from 'axios';

import { useContext, useState, FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { UserContext } from '../../contexts/UserContext';

import { login } from '../../utils/server.ts';

const Login: React.FC = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ error, setError ] = useState<string>('');

  const handleLogin = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setError('');
      const userInfo = await login({username, password});
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      router.push('/');
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex justify-center items-start h-screen">
        <div className="bg-gray-700 p-8 rounded-md shadow-md">
          <h1 className="text-2xl mb-4">Login</h1>
          {error &&
            <div className="mb-4 p-4 bg-red-300 text-red-900 rounded border-red-900">
              {error.message}
            </div>
          }
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
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
