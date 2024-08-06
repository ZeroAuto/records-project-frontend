interface RecordParams {
  name: string;
  artist: string;
}

interface RecordPostParams extends RecordParams {
  format: string;
  year: number;
  purchased: boolean;
  album_art_url: string;
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

interface RecordFormProps {
  editing: boolean;
  name: string;
  artist: string;
  format: string;
  year: string;
  albumArt: string;
  purchased: boolean;
  selectedRecord: any; // Update type if you have a defined type for selectedRecord
  setName: (value: string) => void;
  setArtist: (value: string) => void;
  setFormat: (value: string) => void;
  setYear: (value: string) => void;
  setAlbumArt: (value: string) => void;
  setPurchased: (value: boolean) => void;
  handleAdd: (e: FormEvent<HTMLButtonElement>) => void;
  handleWishlist: (purchased: boolean) => void;
  error: string;
}

export {
  Album,
  RecordFormProps,
  RecordParams,
  RecordPostParams,
  SignUpParams,
}
