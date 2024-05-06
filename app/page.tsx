'use client';

import axios from 'axios';

import React, { useContext, useEffect, useState, ChangeEvent } from 'react';

import { getHeaders } from '../utils/utils.ts';
import { UserContext } from '../contexts/UserContext.tsx';

import LoadingSpinner from '../components/LoadingSpinner.jsx';

interface Album {
  id: number;
  name: string;
  artist: string;
  year: number;
  format: string;
}

const Home: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const [ loading, setLoading ] = useState<Boolean>(false);
  const [ records, setRecords ] = useState<Record[]>([]);
  const [ searchTerm, setSearhcTerm ] = useState<string>('');

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearhcTerm(e.target.value);
  }

  useEffect(() => {
    const delay = searchTerm.length > 0 ? 250 : 0;
    const fetchRecords = async (searchText: string = ''): Promise<any | false> => {
      try {
        const url = currentUser ? `${process.env.NEXT_PUBLIC_API_URL}/record/user` : `${process.env.NEXT_PUBLIC_API_URL}/record`
        setLoading(true);
        const response = await axios.get(
          url,
          {
            headers: getHeaders(),
            params: { text: searchText },
          },
        );
        const records = response.data;
        setRecords(records);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    const getData = setTimeout(() => {
      fetchRecords(searchTerm);
    }, delay);

    return () => clearTimeout(getData);
  }, [currentUser, searchTerm]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex mb-4">
        <input
          className="bg-gray-600 w-full p-2 border border-gray-300 rounded focus:ring focus:outline-none focus:border-blue-300"
          onChange={handleSearchTermChange}
          placeholder="enter search term..."
          type="text"
          value={searchTerm}
        />
      </div>
      {loading &&
        <div className="flex items-center mx-auto mb-4">
          <LoadingSpinner />
        </div> 
      }
      {!loading && records.length > 0 &&
        <table className="min-w-full bg-gray-700 rounded">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Artist</th>
              <th className="px-4 py-2">Year</th>
              <th className="px-4 py-2">Format</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td className="px-4 py-2">{record.name}</td>
                <td className="px-4 py-2">{record.artist_name}</td>
                <td className="px-4 py-2">{record.year}</td>
                <td className="px-4 py-2">{record.format}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}

export default Home; 