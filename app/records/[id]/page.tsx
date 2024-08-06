'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import BackButton from '../../../components/BackButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import RecordForm from '../../../components/RecordForm';
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
  const [ name, setName ] = useState<string>('');
  const [ artist, setArtist ] = useState<string>('');
  const [ year, setYear ] = useState<string>('');
  const [ format, setFormat ] = useState<string>('');
  const [ purchased, setPurchased ] = useState<boolean>(false);
  const [ albumArt, setAlbumArt ] = useState('');
  const [ selectedRecord, setSelectedRecord ] = useState<Album>({});

  const setRecordData = (record) => {
    setName(record.name);
    setArtist(record.artist_name);
    setFormat(record.format);
    setYear(record.year);
    setPurchased(record.purchased)
  }
  
  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetchRecord(id);
      setRecord(res);
      setRecordData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (editing && record) {
      setRecordData(record);
    }
  }, [editing])

  const handleBack = () => {
    router.push('/');
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleUpdate = async () => {};

  const handleWishlist = async () => {};

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
            <RecordForm
              editing={false}
              name={name}
              artist={artist}
              format={format}
              year={year}
              albumArt={albumArt}
              purchased={purchased}
              selectedRecord={selectedRecord}
              setName={setName}
              setArtist={setArtist}
              setFormat={setFormat}
              setYear={setYear}
              setAlbumArt={setAlbumArt}
              setPurchased={setPurchased}
              handleAdd={handleUpdate}
              handleWishlist={handleWishlist}
              error={error}
            />
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
