export const tablePagination = {
  defaultPageSize: 20,
  showSizeChanger: true,
  pageSizeOptions: ["20", "50", "100"],
};

export const generatePagination = (
  dataCount: number = 0,
  setPagination: React.Dispatch<
    React.SetStateAction<{
      current: number;
      pageSize: number;
    }>
  >,
  pagination: {
    current: number;
    pageSize: number;
  }
) => {
  return dataCount !== undefined && dataCount > 20
    ? {
        ...pagination,
        total: dataCount,
        showSizeChanger: true,
        pageSizeOptions: ["20", "50", "100"],
        onChange: (current: number, pageSize: number) => {
          setPagination((prevPagination) => ({
            ...prevPagination,
            current,
            pageSize,
          }));
        },
      }
    : false;
};
