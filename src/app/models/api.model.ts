export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
  timestamp: string;
  path: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
