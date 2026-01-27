export interface PaginationQuery {
  limit?: number;
  skip?: number;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  skip: number;
  page: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export function parsePaginationQuery(query: unknown): {
  limit: number;
  skip: number;
} {
  const q = query as PaginationQuery;
  const limit = Math.min(Math.max(1, q.limit || DEFAULT_LIMIT), MAX_LIMIT);
  const skip = Math.max(0, q.skip || 0);
  return { limit, skip };
}

export function createPaginationMeta(
  total: number,
  limit: number,
  skip: number,
): PaginationMeta {
  const page = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    limit,
    skip,
    page,
    totalPages,
  };
}
