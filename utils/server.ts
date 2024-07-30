import axios, { AxiosResponse } from 'axios';
import { FilterParams, RecordParams, RecordPostParams, SignUpParams } from './interfaces.ts';

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

export const getHeaders = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  if (userInfo && userInfo.access_token) {
    return { Authorization: `Bearer ${userInfo.access_token}` };
  }
  return {};
}

export const findRecord = async (recordData: RecordParams): Promise<AxiosResponse|false> => {
  const res = await axios.get(
    `${baseUrl}/record/find`,
    {
      headers: getHeaders(),
      params: { ...recordData },
    }
  );
  return res.data;
}

export const fetchRecords = async (filterParams: FilterParams): Promise<AxiosResponse|false> => {
  const res = await axios.get(
    `${baseUrl}/record`,
    {
      headers: getHeaders(),
      params: { ...filterParams },
    }
  );
  return res;
}

export const fetchUserRecords = async (filterParams: FilterParams): Promise<AxiosResponse|false> => {
  const res = await axios.get(
    `${baseUrl}/record/user`,
    {
      headers: getHeaders(),
      params: { ...filterParams },
    }
  );
  return res;
}

export const postRecord = async (recordData: RecordPostParams): Promise<AxiosResponse|false> => {
  try {
    const res = await axios.post(
      `${baseUrl}/record`,
      { ...recordData },
      { headers: getHeaders() },
    );
    return res.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const postAddRecord = async (
  recordId: number,
  purchased: boolean = false
): Promise<AxiosResponse|false> => {
  try {
    const res = await axios.post(
      `${baseUrl}/record/add/${recordId}`,
      { purchased },
      { headers: getHeaders() },
    )
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const signup = async (signUpData: SignUpParams): Promise<AxiosResponse|false> => {
  try {
    const res = await axios.post(
      `${baseUrl}/signup`,
      signUpData,
    )
    return res;
  } catch (e) {
    console.log(e);
    return false;
  }
};
