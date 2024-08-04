import axios, { AxiosResponse } from 'axios';
import { 
  FilterParams,
  LoginParams,
  RecordParams,
  RecordPostParams,
  SignUpParams, 
  UserRecord,
} from './interfaces.ts';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = JSON.parse(sessionStorage.getItem('userInfo'))?.refresh_token;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const response = await fetch(`${baseUrl}/refresh`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          sessionStorage.setItem('userInfo', JSON.stringify(data));
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;

          return axios(originalRequest);
        } else {
          sessionStorage.removeItem('userInfo');
          return Promise.reject(error);
        }
      } catch (refreshError) {
        sessionStorage.removeItem('userInfo');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const getHeaders = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  if (userInfo && userInfo.access_token) {
    return { Authorization: `Bearer ${userInfo.access_token}` };
  }
  return {};
}

const throwError = (e: any, defaultMsg: string = "Something went wrong") => {
  if (e?.response?.data?.message) {
    throw new Error(e.response.data.message);
  } else {
    throw new Error(defaultMsg);
  }
};

export const findRecord = async (recordData: RecordParams): Promise<AxiosResponse> => {
  try {
    const res = await axios.get(
      `${baseUrl}/record/find`,
      {
        headers: getHeaders(),
        params: { ...recordData },
      }
    );
    return res.data;
  } catch (e: any) {
    console.log(e);
    throwError(e);
  }
}

export const fetchRecords = async (filterParams: FilterParams): Promise<AxiosResponse> => {
  try {
    const res = await axios.get(
      `${baseUrl}/record`,
      {
        headers: getHeaders(),
        params: { ...filterParams },
      }
    );
    return res;
  } catch (e: any) {
    console.log(e);
    throwError(e);
  }
}

export const fetchUserRecords = async (filterParams: FilterParams): Promise<AxiosResponse> => {
  try {
    const res = await axios.get(
      `${baseUrl}/record/user`,
      {
        headers: getHeaders(),
        params: { ...filterParams },
      }
    );
    return res;
  } catch (e: any) {
    console.log(e);
    throwError(e);
  }
}

export const login = async (loginData: LoginParams): Promise<AxiosResponse> => {
  try {
    const res = await axios.post(
      `${baseUrl}/login`,
      { ...loginData },
    )
    return res.data;
  } catch (e: any) {
    console.log(e);
    throwError(e);
  }
}

export const postRecord = async (recordData: RecordPostParams): Promise<AxiosResponse> => {
  try {
    const res = await axios.post(
      `${baseUrl}/record`,
      { ...recordData },
      { headers: getHeaders() },
    );
    return res.data;
  } catch (e) {
    console.log(e);
    throwError(e);
  }
};

export const postUserRecord = async (
  record_id: number,
  purchased: boolean = false
): Promise<AxiosResponse> => {
  try {
    const res = await axios.post(
      `${baseUrl}/user_record`,
      { purchased, record_id },
      { headers: getHeaders() },
    )
    return res.data;
  } catch (e) {
    console.log(e);
    throwError(e);
  }
};

export const updateUserRecord = async (id: number, userRecordData: UserRecord): Promise<AxiosResponse> =>{
  try {
    const res = await axios.put(
      `${baseUrl}/user_record/${id}`,
      { ...userRecordData },
      { headers: getHeaders() },
    )
    return res.data;
  } catch (e) {
    console.log(e);
    throwError(e);
  }
}

export const removeUserRecord = async (user_record_id: number): Promise<AxiosResponse> => {
  try {
    const res = await axios.delete(`${baseUrl}/user_record/${user_record_id}`);
    return res.data;
  } catch (e) {
    console.log(e);
    throwError(e);
  }
};

export const signup = async (signUpData: SignUpParams): Promise<AxiosResponse> => {
  try {
    const res = await axios.post(
      `${baseUrl}/signup`,
      signUpData,
    )
    return res;
  } catch (e: any) {
    console.log(e);
    throwError(e);
  }
};
