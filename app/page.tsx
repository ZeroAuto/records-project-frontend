'use client';

import axios from 'axios';

import React, { useContext, useEffect, useState, ChangeEvent } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import LoadingSpinner from '../components/LoadingSpinner';
import { UserContext } from '../contexts/UserContext';

import { Album } from '../utils/interfaces.ts';
import { fetchRecords, fetchWishlist } from '../utils/server.ts';

const Home: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const [ loading, setLoading ] = useState<Boolean>(false);
  const [ records, setRecords ] = useState<Album[]>([]);
  const [ searchTerm, setSearchTerm ] = useState<string>('');
  const [ sortColumn, setSortColumn ] = useState<string>('name');
  const [ sortDirection, setSortDirection ] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const delay = searchTerm.length > 0 ? 250 : 0;
    const fetchRecordData = async (searchText: string = ''): Promise<any | false> => {
      try {
        setLoading(true);
        let records;
        if (currentUser) {
          records = await fetchWishlist({searchText, sortColumn, sortDirection});
        } else {
          records = await fetchRecords({searchText, sortColumn, sortDirection});
        }
        setRecords(records);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    const getData = setTimeout(() => {
      fetchRecordData(searchTerm);
    }, delay);

    return () => clearTimeout(getData);
  }, [currentUser, searchTerm, sortColumn, sortDirection]);

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const handleSortChange = (columnName: string) => {
    const direction = sortColumn === columnName && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnName);
    setSortDirection(direction);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <input
          className="bg-gray-600 p-2 border border-gray-300 rounded focus:ring focus:outline-none focus:border-blue-300"
          onChange={handleSearchTermChange}
          placeholder="enter search term..."
          type="text"
          value={searchTerm}
        />
        {currentUser &&
          <Link className="primary-button px-2" href="/records/create">Add Record</Link>
        }
      </div>
      {loading &&
        <LoadingSpinner />
      }
      {!loading && records.length > 0 &&
        <table className="min-w-full bg-gray-700 rounded">
          <thead>
            <tr>
              {['name', 'artist', 'year', 'format'].map(column => (
                <th
                  key={column}
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSortChange(column)}
                >
                  <div class="flex space-x-1">
                    <span>
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                    </span>
                    {sortColumn === column && (
                      <span>
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
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
