interface RecordParams {
  name: string;
  artist: string;
}

interface RecordAddParams extends RecordParams {
  format: string;
  year: number;
  purchased: boolean,
}

interface Album extends RecordAddParams {
  id: number;
}

interface FilterParams {
  searchText: string,
  sortColumn: string,
  sortDirection: string,
}

interface LoginParams {
  username: string,
  password: string,
}

interface SignUpParams extends LoginParams {
  email: string,
  name: string,
}

export {
  Album,
  RecordParams,
  RecordAddParams,
  SignUpParams,
}
