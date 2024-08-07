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
    setAlbumArt(record.album_art_url)
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
              handleWishlist={() => {}}
              error={error}
            />
            :
          <div className="max-w-sm mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            {record?.album_art_url &&
              <img
                className="w-full h-48 object-cover"
                src={record.album_art_url}
                alt={`Artwork for ${record.name}`}
              />
            }
            <div className="p-4">
              <h2 className="text-xl font-semibold text-white">{record.name}</h2>
              <p className="text-gray-300">{record.artist_name}</p>
              <p className="text-gray-400 text-sm">{record.year}</p>
              <p className="text-gray-500 text-xs">{record.format}</p>
            </div>
          </div>
          }
        </div>
      }
    </div>
  )
};

export default Record;
