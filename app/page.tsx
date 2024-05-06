'use client';

import React, { useEffect, useState } from 'react';

import LoadingSpinner from '../components/LoadingSpinner.jsx';

interface Album {
  id: number;
  name: string;
  artist: string;
  year: number;
  format: string;
}

const Home: React.FC = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    const fetchRecords = async (searchText: string = ''): Promise<any | false> => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/record?text=${encodeURIComponent(searchText)}`);
        const data = await res.json();
        setRecords(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
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
