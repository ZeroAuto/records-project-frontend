'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '../../../components/LoadingSpinner';
import { UserContext } from '../../../contexts/UserContext';
import { fetchRecord } from '../../../utils/server.ts';

const Record = ({ params }) => {
  const { id } = params;
  const router = useRouter()
  const { currentUser } = useContext(UserContext);
  const [ record, setRecord ] = useState({});
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');
  const [ editing, setEditing ] = useState(false);
  
  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetchRecord(id);
      setRecord(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between mb-4 align-middle">
        <button 
          class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={handleBack}
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>
        {currentUser?.admin &&
          <button
            className="primary-button px-3"
            onClick={handleEditToggle}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        }
      </div>
      {loading &&
        <LoadingSpinner />
      }
      {!loading && record &&
        <div>
          {editing ?
            null
            :
            <div>
              <p>
                {record.name}
              </p>
              <p>
                {record.artist_name}
              </p>
              {record?.album_art_url &&
                <p>
                  {record.album_art_url}
                </p>
              }
            </div>
          }
        </div>
      }
    </div>
  )
};

export default Record;
