'use client';

import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState, ChangeEvent } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import LoadingSpinner from '../components/LoadingSpinner';
import { UserContext } from '../contexts/UserContext';

import { Album } from '../utils/interfaces.ts';
import { fetchRecords, fetchUserRecords } from '../utils/server.ts';

const Home: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const [ displayCount, setDisplayCount ] = useState<number>(0);
  const [ loading, setLoading ] = useState<Boolean>(false);
  const [ records, setRecords ] = useState<Album[]>([]);
  const [ searchTerm, setSearchTerm ] = useState<string>('');
  const [ sortColumn, setSortColumn ] = useState<string>('name');
  const [ sortDirection, setSortDirection ] = useState<'asc' | 'desc'>('asc');
  const [ queryType, setQueryType ] = useState<string>('all');
  const [ totalCount, setTotalCount ] = useState<number>(0);

  const fetchRecordData = useCallback(async (nextPage: boolean = false): Promise<any | false> => {
    try {
      setLoading(true);
      const offset = nextPage && displayCount < totalCount ? displayCount : 0;
      if (!nextPage) setDisplayCount(0);

      const queryParams = { searchTerm, sortColumn, sortDirection, offset };
      if (queryType !== 'all' && currentUser) queryParams.purchased = queryType === 'purchased';
      const res = currentUser ? await fetchUserRecords(queryParams) : await fetchRecords(queryParams);
      
      setTotalCount(res.headers['x-total-count']);

      const newRecords = nextPage && displayCount < totalCount ? [...records, ...res.data] : res.data;
      setDisplayCount(newRecords.length);
      setRecords(newRecords);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, searchTerm, sortColumn, sortDirection, displayCount, totalCount, queryType]);

  useEffect(() => {
    const delay = searchTerm.length > 0 ? 250 : 0;

    const getData = setTimeout(() => {
      fetchRecordData();
    }, delay);

    return () => clearTimeout(getData);
  }, [currentUser, searchTerm, sortColumn, sortDirection, queryType]);

  const handleNext = () => {
    fetchRecordData(true);
  };

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const handleSortChange = (columnName: string) => {
    const direction = sortColumn === columnName && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnName);
    setSortDirection(direction);
  };

  const handleQueryTypeChange = (value: string) => {
    setQueryType(value);
  }

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
      {currentUser &&
        <div className="flex justify-center mb-4 space-x-4">
          {['all', 'wishlist', 'purchased'].map(type => (
            <button
              key={type}
              className={`px-4 py-2 rounded ${queryType === type ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              onClick={() => handleQueryTypeChange(type)}
            >
              {type === 'purchased' ? 'Collection' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      }
      {displayCount > 0 &&
        <table className="min-w-full bg-gray-700 rounded mb-4">
          <thead>
            <tr>
              {['name', 'artist', 'year', 'format'].map(column => (
                <th
                  key={column}
                  className="px-4 py-2 cursor-pointer"
                  onClick={() => handleSortChange(column)}
                >
                  <div className="flex space-x-1">
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
      {loading &&
        <LoadingSpinner />
      }
      {!loading && displayCount < totalCount &&
        <div className="flex justify-center">
          <button
            className="primary-button px-2"
            onClick={handleNext}
          >Next Page</button>
        </div>
      }
    </div>
  );
}

export default Home;
