export class ApiError extends Error {
  public status: number;
  public code: string;

  constructor(message: string, status: number = 500, code: string = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export class BillReaderError extends ApiError {
  constructor(message: string, status: number = 500) {
    super(message, status, 'BILL_READER_ERROR');
    this.name = 'BillReaderError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unknown error occurred');
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('fetch') || 
           error.message.includes('network') || 
           error.message.includes('Failed to fetch');
  }
  return false;
}; 