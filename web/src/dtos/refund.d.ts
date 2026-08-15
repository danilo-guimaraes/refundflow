type RefundAPIResponse = {
  id: string;
  useId: string;
  name: string;
  category: CategoriesAPIEnum;
  amount: number;
  filename: string;
  user: {
    name: string;
  };
};

type RefundsPagintationAPIResponse = {
  refunds: RefundAPIResponse[];
  pagination: {
    page: number;
    perPage: number;
    totalRecords: number;
    totalPages: number;
  };
};
