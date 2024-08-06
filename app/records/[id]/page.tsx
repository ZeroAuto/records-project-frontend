'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '../../../components/LoadingSpinner';
import BackButton from '../../../components/BackButton';
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
        <div
          onClick={handleBack}
        >
          <BackButton onClick={handleBack} />
        </div>
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
