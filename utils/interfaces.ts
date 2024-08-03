interface RecordParams {
  name: string;
  artist: string;
}

interface RecordPostParams extends RecordParams {
  format: string;
  year: number;
  purchased: boolean,
}

interface Album extends RecordPostParams {
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

interface UserRecord {
  purchased: boolean,
  record_id: number,
  user_id: number,
}

export {
  Album,
  RecordParams,
  RecordPostParams,
  SignUpParams,
}
