'use client';

import axios from 'axios';

import { useContext, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../contexts/UserContext.tsx';

const Login: React.FC = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ error, setError ] = useState<string>('');

  const handleLogin = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        { username, password, },
      )
      const userInfo = res.data;
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      router.push('/');
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="bg-gray-700 p-8 rounded-md shadow-md">
        <h1 className="text-2xl mb-4">Login</h1>
        <input
          type="text"
          placeholder="Username"
          className="bg-gray-600 w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-gray-600 w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
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
  );
}

export default Login;
