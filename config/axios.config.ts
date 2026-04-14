import axios, { AxiosInstance } from 'axios';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
    timeout: 50000,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      const message = error.response?.data?.error ?? error.message;
      return Promise.reject(new Error(message));
    }
  );

  return instance;
};

export const api = createAxiosInstance();
