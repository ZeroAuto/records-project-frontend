'use client';

import axios from 'axios';

import React, { useEffect, useLayoutEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Album, RecordParams } from '../../../utils/interfaces.ts';
import { findRecord } from '../../../utils/server.ts';
import { getHeaders } from '../../../utils/utils.ts';

const Record: React.FC = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo) {
      router.push('/');
    }
  });

  const [ name, setName ] = useState<string>('');
  const [ artist, setArtist ] = useState<string>('');
  const [ year, setYear ] = useState<string>('');
  const [ format, setFormat ] = useState<string>('');
  const [ selectedRecord, setSelectedRecord ] = useState<Album>({});

  useEffect(() => {
    const fetchRecordData = async (recordData: RecordParams) => {
      if (recordData.name.length > 0 && recordData.artist.length > 0) {
        const record = await findRecord(recordData);
        setSelectedRecord(record);
      }
    };

    const getData = setTimeout(() => {
      fetchRecordData({ name, artist });
    }, 250);
    return () => clearTimeout(getData);
  }, [name, artist]);

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="bg-gray-700 p-8 rounded-md shadow-md">
        <h1 className="text-2xl mb-4">Add Record</h1>
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
        <button
          className="primary-button"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default Record;
