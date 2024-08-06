'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '../../../components/LoadingSpinner';
import { fetchRecord } from '../../../utils/server.ts';

const Record = ({ params }) => {
  const { id } = params;
  const router = useRouter()
  const [ record, setRecord ] = useState({});
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');
  
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
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <button
          className="primary-button px-3"
          onClick={handleBack}
        >Back</button>
        <button className="primary-button px-3">Edit</button>
      </div>
      {loading &&
        <LoadingSpinner />
      }
      {!loading && record &&
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
  )
};

export default Record;
