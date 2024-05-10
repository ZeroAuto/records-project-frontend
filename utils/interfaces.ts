interface Album {
  id: number;
  name: string;
  artist: string;
  year: number;
  format: string;
}

interface RecordParams {
  name: string;
  artist: string;
}

export {
  Album,
  RecordParams,
}
