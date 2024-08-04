import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDollarSign, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Album, UserRecord } from '../utils/interfaces.ts';

interface DataTableProps {
  records: Album[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  handleSortChange: (columnName: string) => void;
  handleAddToList: (record: Album, purchased: boolean) => void;
  handleRemove: (user_record_id: number) => void;
  currentUser: boolean | null;
  queryType: 'all' | 'wishlist' | 'purchased';
}

const DataTable: React.FC<DataTableProps> = ({
  records,
  sortColumn,
  sortDirection,
  handleSortChange,
  handleAddToList,
  handleRemove,
  currentUser,
  queryType,
}) => {
  return (
    <table className="min-w-full bg-gray-700 rounded mb-4">
      <thead>
        <tr>
          {['name', 'artist', 'year', 'format'].map((column) => (
            <th
              key={column}
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSortChange(column)}
            >
              <div className="flex space-x-1">
                <span>{column.charAt(0).toUpperCase() + column.slice(1)}</span>
                {sortColumn === column && (
                  <span>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
            </th>
          ))}
          {currentUser && <th className="px-4 py-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td className="px-4 py-2 max-w-72 overflow-hidden whitespace-nowrap hover:overflow-visible hover:whitespace-normal">
              {record.name}
            </td>
            <td className="px-4 py-2 max-w-64 overflow-hidden whitespace-nowrap hover:overflow-visible hover:whitespace-normal">
              {record.artist_name}
            </td>
            <td className="px-4 py-2">{record.year}</td>
            <td className="px-4 py-2">{record.format}</td>
            {currentUser && (
              <td className="px-4 py-2">
                <div className="flex space-x-2 justify-center">
                  {!record.users_records_id || record.purchased === true ? (
                    <button
                      className="px-2 my-1 bg-blue-500 text-white rounded relative group"
                      onClick={() => handleAddToList(record, false)}
                    >
                      <FontAwesomeIcon
                        className="w-6"
                        icon={faPlus} 
                      />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
                        {queryType === 'all' ? 'Add to Wishlist' : 'Move to Wishlist'}
                      </span>
                    </button>
                  ) : null}
                  {!record.users_records_id || record.purchased === false ? (
                    <button
                      className="px-2 my-1 bg-green-500 text-white rounded relative group"
                      onClick={() => handleAddToList(record, true)}
                    >
                      <FontAwesomeIcon
                        className="w-6"
                        icon={faDollarSign} 
                      />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
                        {queryType === 'all' ? 'Add to Collection' : 'Move to Collection'}
                      </span>
                    </button>
                  ) : null}
                  {record.users_records_id && (
                    <button
                      className="px-2 my-1 bg-red-500 text-white rounded relative group"
                      onClick={() => handleRemove(record.users_records_id)}
                    >
                      <FontAwesomeIcon
                        className="w-6"
                        icon={faTimes} 
                      />
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100">
                        Remove from List
                      </span>
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
