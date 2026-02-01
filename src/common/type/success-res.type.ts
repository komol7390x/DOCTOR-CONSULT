export interface IResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: object;
}

export class PaginationResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.meta = {
      totalItems: total,
      itemCount: data.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page
    };
  }
}
