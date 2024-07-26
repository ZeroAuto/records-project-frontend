'use client';

import axios from 'axios';

import React, { useContext, useEffect, useLayoutEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import LoadingSpinner from '../../../components/LoadingSpinner';
import { UserContext } from '../../../contexts/UserContext'

import { Album, RecordParams } from '../../../utils/interfaces.ts';
import { findRecord, postAddRecord, postRecord } from '../../../utils/server.ts';

const Record: React.FC = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo) {
      router.push('/');
    }
  });

  const { currentUser } = useContext(UserContext);
  const [ loading, setLoading ] = useState<Boolean>(false);
  const [ name, setName ] = useState<string>('');
  const [ artist, setArtist ] = useState<string>('');
  const [ year, setYear ] = useState<string>('');
  const [ format, setFormat ] = useState<string>('');
  const [ purchased, setPurchased ] = useState<boolean>(false);
  const [ selectedRecord, setSelectedRecord ] = useState<Album>({});

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
      const record = await postAddRecord(selectedRecord.id, purchased);
      if (record) router.push('/');
    } catch (error) {
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
      }
      const record = await postRecord(recordData);
      if (record) router.push('/');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-center items-start h-screen">
        {loading ?
          <LoadingSpinner />
          :
          <div className="bg-gray-700 p-8 rounded-md shadow-md w-full">
            <h1 className="text-2xl mb-4">Add Record</h1>
            {Object.keys(selectedRecord).length > 0 ? 
              !selectedRecord.owned_by_user ?
                (
                  <div className="mb-4 p-4 bg-green-300 text-green-900 rounded border-green-900">
                    Record already exists: {selectedRecord.name} by {selectedRecord.artist_name}. Would you like to add it to your&nbsp;
                    <span
                      className="underline cursor-pointer"
                      onClick={() => handleWishlist(false)}
                    >wishlist&nbsp;</span>
                      or&nbsp;
                    <span
                      className="underline cursor-pointer"
                      onClick={() => handleWishlist(true)}
                    >
                      purchased list?
                    </span>
                  </div>
                )
                :
                <div className="mb-4 p-4 bg-red-300 text-red-900 rounded border-red-900">
                  <span>This record is already in your lists</span>
                </div>
              :
              null
            }
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              className="form-input-field"
              id="name"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Name"
              value={name}
            />
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="artist"
            >
              Artist
            </label>
            <input
              type="text"
              className="form-input-field"
              id="artist"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)}
              placeholder="Artist"
              value={artist}
            />
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="format"
            >
              Format
            </label>
            <input
              type="text"
              className="form-input-field"
              id="format"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormat(e.target.value)}
              placeholder="Format"
              value={format}
            />
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="year"
            >
              Year
            </label>
            <input
              type="text"
              className="form-input-field"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setYear(e.target.value)}
              placeholder="Year"
              value={year}
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="wishlist"
                className="mr-2"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPurchased(e.target.checked)}
                checked={purchased}
              />
              <label htmlFor="wishlist" className="text-sm">
                I own this record
              </label>
            </div>
            <button
              className="w-full primary-button"
              disabled={Object.keys(selectedRecord).length > 0}
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default Record;
