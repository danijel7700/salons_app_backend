export type PaginationOptions = {
  page?: number;
  limit?: number;
  skip?: number;
  sort?: {
    sortBy: string;
    direction: string;
  };
  populate?: string;
  projection?: string[];
  filter?: Object;
};
