'use client';

import axios from 'axios';

import React, { useContext, useEffect, useLayoutEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import BackButton from '../../../components/BackButton';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { UserContext } from '../../../contexts/UserContext';
import RecordForm from '../../../components/RecordForm';
// import RecordForm from './RecordForm'; // Update the path if necessy

import { Album, RecordParams } from '../../../utils/interfaces.ts';
import { findRecord, postUserRecord, postRecord } from '../../../utils/server.ts';

const Record: React.FC = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo) {
      router.push('/');
    }
  });

  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState<Boolean>(false);
  const [name, setName] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [format, setFormat] = useState<string>('');
  const [purchased, setPurchased] = useState<boolean>(false);
  const [albumArt, setAlbumArt] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<Album>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRecordData = async (recordData: RecordParams) => {
      if (recordData.name.length > 0 && recordData.artist.length > 0) {
        const record = await findRecord(recordData);
        setSelectedRecord(record);
      } else {
        setSelectedRecord({});
      }
    };

    const getData = setTimeout(() => {
      fetchRecordData({ name, artist });
    }, 250);
    return () => clearTimeout(getData);
  }, [name, artist]);

  const handleWishlist = async (purchased: boolean = false) => {
    try {
      setLoading(true);
      setError('');
      const record = await postUserRecord(selectedRecord.id, purchased);
      if (record) router.push('/');
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const recordData = {
        name: name,
        artist: artist,
        year: year,
        format: format,
        purchased: purchased,
        album_art_url: albumArt,
      }
      const record = await postRecord(recordData);
      if (record) router.push(`/records/${record.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex mb-4">
        <div onClick={handleBack}>
          <BackButton />
        </div>
      </div>
      <div className="flex justify-center items-start h-screen">
        {loading ?
          <LoadingSpinner />
          :
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
            handleAdd={handleAdd}
            handleWishlist={handleWishlist}
            error={error}
          />
        }
      </div>
    </div>
  )
}

export default Record;
