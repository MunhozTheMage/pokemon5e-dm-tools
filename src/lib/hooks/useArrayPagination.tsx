import { useMemo } from "react";

export const useArrayPagination = <T,>(
  array: T[],
  { perPage, currentPage }: { perPage: number; currentPage: number }
) =>
  useMemo(
    () => array.slice(perPage * currentPage, perPage * currentPage + perPage),
    [array, perPage, currentPage]
  );
