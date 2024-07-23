import axios, { AxiosResponse } from 'axios';
import { FilterParams, RecordParams } from './interfaces.ts';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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

export const postRecord = async (recordData): Promise<AxiosResponse|false> => {
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
