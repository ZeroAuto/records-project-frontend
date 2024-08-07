import React, { ChangeEvent, FormEvent } from 'react';
import { RecordFormProps } from '../utils/interfaces.ts';

const RecordForm: React.FC<RecordFormProps> = ({
  editing,
  name,
  artist,
  format,
  year,
  albumArt,
  purchased,
  selectedRecord,
  setName,
  setArtist,
  setFormat,
  setYear,
  setAlbumArt,
  setPurchased,
  handleAdd,
  handleWishlist,
  error,
}) => {
  return (
    <div className="bg-gray-700 p-8 rounded-md shadow-md w-full">
      <h1 className="text-2xl mb-4">Add Record</h1>
      {Object.keys(selectedRecord).length && !editing > 0 ? 
        !selectedRecord.owned_by_user ?
          (
            <div className="mb-4 p-4 bg-green-300 text-green-900 rounded border-green-900">
              Record already exists: {selectedRecord.name} by {selectedRecord.artist_name}. Would you like to add it to your&nbsp;
              <span
                className="underline cursor-pointer"
                onClick={() => handleWishlist(false)}
              >
                wishlist&nbsp;
              </span>
              or&nbsp;
              <span
                className="underline cursor-pointer"
                onClick={() => handleWishlist(true)}
              >
                purchased&nbsp;
              </span>
              list?
            </div>
          )
          :
          <div className="mb-4 p-4 bg-red-300 text-red-900 rounded border-red-900">
            <span>This record is already in your lists</span>
          </div>
        :
        null
      }
      <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
      <input
        type="text"
        className="form-input-field"
        id="name"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        placeholder="Name"
        value={name}
      />
      <label className="block text-sm font-medium mb-1" htmlFor="artist">Artist</label>
      <input
        type="text"
        className="form-input-field"
        id="artist"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)}
        placeholder="Artist"
        value={artist}
      />
      <label className="block text-sm font-medium mb-1" htmlFor="format">Format</label>
      <select
        className="form-input-field"
        id="format"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormat(e.target.value)}
        value={format}
      >
        <option value="">Select Format</option>
        <option value="Album">Album</option>
        <option value="Single">Single</option>
        <option value="EP">EP</option>
        <option value="Boxed Set">Boxed Set</option>
      </select>
      <label className="block text-sm font-medium mb-1" htmlFor="year">Year</label>
      <input
        type="text"
        className="form-input-field"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setYear(e.target.value)}
        placeholder="Year"
        value={year}
      />
      <label className="block text-sm font-medium mb-1" htmlFor="album_art">Link to Album Art</label>
      <input
        type="text"
        className="form-input-field"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setAlbumArt(e.target.value)}
        placeholder="URL"
        value={albumArt}
      />
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="wishlist"
          className="mr-2"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPurchased(e.target.checked)}
          checked={purchased}
        />
        <label htmlFor="wishlist" className="text-sm">Add to Collection</label>
      </div>
      <button
        className="w-full primary-button"
        disabled={Object.keys(selectedRecord).length > 0}
        onClick={handleAdd}
      >
        { editing ? 'Update' : 'Add '}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default RecordForm;
