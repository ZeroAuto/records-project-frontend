import React from 'react';

import { Album, UserRecord } from '../utils/interfaces.ts';

interface DataTableProps {
  records: Album[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  handleSortChange: (columnName: string) => void;
  handleAddToList: (record: Album, purchased: boolean) => void;
  handleRemove: (user_record_id: number) => void;
  currentUser: boolean | null;
}

const DataTable: React.FC<DataTableProps> = ({
  records,
  sortColumn,
  sortDirection,
  handleSortChange,
  handleAddToList,
  handleRemove,
  currentUser,
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
                <div className="flex space-x-2 justify-between">
                  {!record.users_records_id || record.purchased === true ? (
                    <button
                      className="p-1 bg-blue-500 text-white rounded"
                      onClick={() => handleAddToList(record, false)}
                    >
                      Wishlist
                    </button>
                  ) : null}
                  {!record.users_records_id || record.purchased === false ? (
                    <button
                      className="p-1 bg-green-500 text-white rounded"
                      onClick={() => handleAddToList(record, true)}
                    >
                      Collection
                    </button>
                  ) : null}
                  {record.users_records_id && (
                    <button
                      className="p-1 bg-red-500 text-white rounded"
                      onClick={() => handleRemove(record.users_records_id)}
                    >
                      Remove
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
