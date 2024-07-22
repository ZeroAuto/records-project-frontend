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

interface FilterParams {
  searchText: string,
  sortColumn: string,
  sortDirection: string,
}


export {
  Album,
  RecordParams,
  RecordAddParams,
}
