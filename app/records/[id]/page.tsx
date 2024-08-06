import { fetchRecord } from '../../../utils/server.ts';

const Record = async ({ params }) => {
  const { id } = params;
  const record = await fetchRecord(id)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <button className="primary-button px-3">Back</button>
        <button className="primary-button px-3">Edit</button>
      </div>
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
  )
};

export default Record;
