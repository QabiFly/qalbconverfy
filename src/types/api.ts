/**
 * Defensive types for the response envelope. The backend wraps every
 * response as { success, data, message? } / { success, error }, but
 * since no OpenAPI contract exists to verify this against, fields on
 * the error side are kept optional so a malformed/unexpected error
 * body degrades gracefully instead of crashing the UI.
 */
export interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    detail?: string;
    code?: string;
    errors?: Record<string, string[]>;
  };
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

/** Cursor-paginated list shape used by feed/list endpoints. */
export interface CursorPage<T> {
  results: T[];
  next_cursor: string | null;
}

/** Offset-paginated list shape used by standard list endpoints. */
export interface OffsetPage<T> {
  results: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}