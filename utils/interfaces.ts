interface RecordParams {
  name: string;
  artist: string;
}

interface RecordAddParams extends RecordParams {
  format: string;
  year: number;
}

interface Album extends RecordAddParams {
  id: number;
}


export {
  Album,
  RecordParams,
  RecordAddParams,
}
