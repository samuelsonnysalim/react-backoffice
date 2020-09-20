import React, { useState, useEffect } from "react";
import { Pagination as PaginationBootstrap } from "react-bootstrap";

export interface Pagination {
  page: number;
  size: number;
  maxPage: number;
  pageQueryString: string;
  sizeQueryString: string;
  pagePropertyPath: string;
  maxPagePropertyPath: string;
  paginatedDataResourceUrl: string;
  isZeroPageBased: boolean;
  setPage: (page: number) => void;
  setMaxPage: (maxPage: number) => void;
  setDataResourceUrl: (dataResourceUrl: string) => void;
}

interface UsePaginationConfig {
  pagePropertyPath: string;
  maxPagePropertyPath: string;
  currentPage: number;
  size: number;
  isZeroPageBased: false;
  pageQueryString: string;
  sizeQueryString: string;
}

const defaultPagePropertyPath = "";
const defaultMaxPagePropertyPath = "";
const defaultCurrentPage = 1;
const defaultSize = 1;
const defaultPageQueryString = "page";
const defaultSizeQueryString = "size";

export const usePagination = (config: Partial<UsePaginationConfig> = {}): Pagination => {
  // eslint-disable-next-line prefer-const
  let [page, setPage] = useState<number>(config.currentPage || defaultCurrentPage);
  const [maxPage, setMaxPage] = useState<number>(Number.MAX_SAFE_INTEGER);
  const [dataResourceUrl, setDataResourceUrl] = useState<string>();

  if (page > maxPage) {
    page = config.isZeroPageBased ? maxPage - 1 : maxPage;
  } else if (page < (config.isZeroPageBased ? 0 : 1)) {
    page = config.isZeroPageBased ? 0 : 1;
  }

  useEffect(() => {
    setPage(config.currentPage);
  }, [config.currentPage]);

  return {
    page,
    size: config.size || defaultSize,
    maxPage: maxPage === Number.MAX_SAFE_INTEGER ? 1 : maxPage,
    pageQueryString: config.pageQueryString || defaultPageQueryString,
    sizeQueryString: config.sizeQueryString || defaultSizeQueryString,
    pagePropertyPath: config.pagePropertyPath || defaultPagePropertyPath,
    maxPagePropertyPath: config.maxPagePropertyPath || defaultMaxPagePropertyPath,
    paginatedDataResourceUrl: dataResourceUrl
      ? `${dataResourceUrl}${dataResourceUrl.includes("?") ? "&" : "?"}${config.pageQueryString ||
          defaultPageQueryString}=${page}&${config.sizeQueryString || defaultSizeQueryString}=${config.size ||
          defaultSize}`
      : null,
    isZeroPageBased: config.isZeroPageBased ? true : false,
    setPage,
    setMaxPage,
    setDataResourceUrl,
  };
};

interface Props {
  className: string;
  pagination: Pagination;
  visible: boolean;
}

export const PaginationComponent = (props: Partial<Props>): JSX.Element =>
  props.pagination && props.visible ? (
    <>
      <PaginationBootstrap className={props.className}>
        <PaginationBootstrap.First onClick={() => props.pagination.setPage(props.pagination.isZeroPageBased ? 0 : 1)} />
        <PaginationBootstrap.Prev onClick={() => props.pagination.setPage(props.pagination.page - 1)} />
        {[...Array(props.pagination.maxPage)].map((_, index) => (
          <PaginationBootstrap.Item
            key={index}
            active={index + (props.pagination.isZeroPageBased ? 0 : 1) === props.pagination.page}
            onClick={() => props.pagination.setPage(index + (props.pagination.isZeroPageBased ? 0 : 1))}
          >
            {index + 1}
          </PaginationBootstrap.Item>
        ))}
        <PaginationBootstrap.Next onClick={() => props.pagination.setPage(props.pagination.page + 1)} />
        <PaginationBootstrap.Last
          onClick={() =>
            props.pagination.setPage(
              props.pagination.isZeroPageBased ? props.pagination.maxPage - 1 : props.pagination.maxPage,
            )
          }
        />
      </PaginationBootstrap>
      <div className="clearfix" />
    </>
  ) : null;
