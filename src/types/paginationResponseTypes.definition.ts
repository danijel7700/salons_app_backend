export type PaginationResponseType<T> = {
  items: T[];
  totalItems: number;
  page: number;
  totalPages: number;
};
