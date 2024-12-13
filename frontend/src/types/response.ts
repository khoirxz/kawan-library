export interface responseProps {
  code: number;
  status: string;
  message: string;
}

export interface paginateProps {
  totalItem: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
