'use client';

import axios from 'axios';

import React, { useLayoutEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

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
  
  const handleNameChange = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setName(e.target.value);
  }

  const handleArtistChange = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setName(e.target.value);
  }

  const handleYearChange = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setName(e.target.value);
  }

  const handleFormatChange = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setName(e.target.value);
  }

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
          onChange={handleNameChange}
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
          onChange={handleArtistChange}
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
          onChange={handleFormatChange}
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
          onChange={handleYearChange}
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
