'use client';

import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import LoadingSpinner from '../components/LoadingSpinner';
import { UserContext } from '../contexts/UserContext';

import { Album, RecordPostParams, UserRecord } from '../utils/interfaces.ts';
import { fetchRecords, postUserRecord, removeUserRecord, updateUserRecord } from '../utils/server.ts';
import RecordsTable from '../components/RecordsTable';

const Home: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  
  const router = useRouter();
  const queryTypeParam = router.query?.queryType as string || 'all';

  const [ displayCount, setDisplayCount ] = useState<number>(0);
  const [ loading, setLoading ] = useState<Boolean>(false);
  const [ records, setRecords ] = useState<Album[]>([]);
  const [ searchTerm, setSearchTerm ] = useState<string>('');
  const [ sortColumn, setSortColumn ] = useState<string>('name');
  const [ sortDirection, setSortDirection ] = useState<'asc' | 'desc'>('asc');
  const [ queryType, setQueryType ] = useState<string>('all');
  const [ totalCount, setTotalCount ] = useState<number>(0);
  const [ limit, setLimit ] = useState<number>(20);

  const fetchRecordData = useCallback(async (nextPage: boolean = false): Promise<any | false> => {
    try {
      setLoading(true);
      let tempLimit = limit;

      if (!nextPage) {
        const windowHeight = window.innerHeight - 300;
        tempLimit = Math.floor(currentUser ? windowHeight / 48 : windowHeight / 40);
        setLimit(tempLimit);
      }

      const offset = nextPage && displayCount < totalCount ? displayCount : 0;
      if (!nextPage) setDisplayCount(0);

      const queryParams = { searchTerm, sortColumn, sortDirection, offset, limit: tempLimit };
      if (queryType !== 'all' && currentUser) queryParams.purchased = queryType === 'purchased';
      const res = await fetchRecords(queryParams);
      
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

  const updateSingleRecord = (recordId: number, userRecord: UserRecord | false = false) => {
    setRecords(prev => {
      const record = prev.find(record => record.id === recordId);
      if (record) {
        record.users_records_id = userRecord?.id ?? null;
        record.purchased = userRecord?.purchased ?? null;
      }
      return [...prev];
    });
  };

  const removeRecordFromTable = (record_id: number) => {
    setRecords(records => records.filter(record => record.id !== record_id));
    setDisplayCount(prev => prev --);
    setTotalCount(prev => prev --);
  };

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

  const handleAddToList = async (record: RecordPostParams, purchased: boolean) => {
    let userRecord;
    if (record.users_records_id) {
      userRecord = await updateUserRecord(
        record.users_records_id,
        {
          record_id: record.id,
          user_id: record.user_id,
          purchased: purchased,
        }
      );
    } else {
      userRecord = await postUserRecord(record.id, purchased);
    }
    if (queryType !== 'all') removeRecordFromTable(record.id);
    if (queryType === 'all') updateSingleRecord(record.id, userRecord);
  };

  const handleRemove = async (user_record_id: number) => {
    const userRecord = await removeUserRecord(user_record_id);
    if (queryType !== 'all') removeRecordFromTable(userRecord.record_id);
    if (queryType === 'all') updateSingleRecord(userRecord.record_id);
  }

  return (
    <div className="max-w-3xl mx-auto">
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
        <RecordsTable
          records={records}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSortChange={handleSortChange}
          handleAddToList={handleAddToList}
          handleRemove={handleRemove}
          currentUser={currentUser}
          queryType={queryType}
        />
      }
      {displayCount === 0 && !loading &&
        <div className="flex justify-center">
          <h2 className="text-2xl">
            Nothing here
          </h2>
        </div>
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
