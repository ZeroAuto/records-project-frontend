import { fetchRecord } from '../../../utils/server.ts';

const Record = async ({ params }) => {
  const { id } = params;
  const record = await fetchRecord(id)
  return (
    <div>
      <p>
        {record.name}
      </p>
      <p>
        {record.artist_name}
      </p>
    </div>
  )
};

export default Record;
