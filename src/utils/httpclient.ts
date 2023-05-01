import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse, CreateAxiosDefaults } from 'axios';
import { logger } from './logger';

export const httpClientInstance = (requestData: CreateAxiosDefaults): AxiosInstance => {
  const axiosInstance: AxiosInstance = axios.create(requestData);

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: any) => {
      // Do something before request is sent
      // For example, add an authorization token to the headers
      logger.info('-------------------------------- Request sent  --------------------------------');
      const data = { baseUrl: config?.baseUrl, url: config.url, data: config.data };

      logger.info(JSON.stringify(data));
      return config;
    },
    (error: AxiosError) => {
      // Do something with request error
      logger.info('-------------------------------- Request ERROR --------------------------------');
      logger.error(error);
      return Promise.reject(error);
    },
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: any) => {
      // Any status code that lies within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    (error: AxiosError) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logger.info('Error data:', error.response.data);
        logger.info('Error status:', error.response.status);
        logger.info('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        logger.info('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        logger.info('Error message:', error.message);
        logger.error(error);
      }

      return Promise.reject(error);
    },
  );
  return axiosInstance;
};
