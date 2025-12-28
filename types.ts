
export interface GenerationResult {
  imageUrl: string;
  originalUrl: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}

export enum StyleRef {
  CHIBI_GIRL = 'CHIBI_GIRL'
}
