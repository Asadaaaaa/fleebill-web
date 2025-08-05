export class ApiError extends Error {
  status;
  code;

  constructor(message, status = 500, code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export class BillReaderError extends ApiError {
  constructor(message, status = 500) {
    super(message, status, 'BILL_READER_ERROR');
    this.name = 'BillReaderError';
  }
}

export const handleApiError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unknown error occurred');
};

export const isNetworkError = (error) => {
  if (error instanceof Error) {
    return error.message.includes('fetch') || 
           error.message.includes('network') || 
           error.message.includes('Failed to fetch');
  }
  return false;
}; 