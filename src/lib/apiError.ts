import axios, { AxiosError } from 'axios';
import ErrorResponse from '@/types/ErrorResponse';

const apiError = (err: unknown): string => {
  const error = err as Error | AxiosError<ErrorResponse>;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      return error.response.data.message.length
        ? error.response.data.message
        : `${error.response.status} : ${error.response.statusText}`;
    } else {
      return error.message;
    }
  } else {
    return error.message;
  }
};

export default apiError;
