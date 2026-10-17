import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!error) {
    return fallback;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (isFetchBaseQueryError(error)) {
    const { data } = error;

    if (typeof data === 'string') {
      return data;
    }

    if (typeof data === 'object' && data !== null) {
      if ('message' in data) {
        if (typeof data.message === 'string') {
          return data.message;
        }

        if (
          Array.isArray(data.message) &&
          data.message.every((m) => typeof m === 'string')
        ) {
          return data.message.join(' ');
        }
      }

      if ('error' in data && typeof data.error === 'string') {
        return data.error;
      }
    }
  }

  return fallback;
}
