import React, { useCallback, useState, useEffect, ReactNode } from "react";
import { Master, Response, usePagination, useSorting, SortedFields } from "react-backoffice";
import Router from "next/router";

export interface Query {
  [key: string]: string | string[];
}

interface Props {
  query: Query;
  title: string;
  dataFetchingResourcePath: string;
  newInstanceFetchingResourcePath: string;
  updateInstanceFetchingResourcePath: string;
  deleteInstanceFetchingResourcePath: string;
  children: ReactNode;
}

const size = 2;

const getCurrentPage = (query?: Query): number => {
  return parseInt(query?.page as string) || 1;
};

const getCurrentSortedFields = (query?: Query): SortedFields => {
  const sortedFields: SortedFields = {};
  const sort = typeof query?.sort === "string" ? [query.sort] : query?.sort;
  sort?.forEach(sort => {
    const [field, order] = sort.split(",");
    if (field && ["asc", "desc"].includes(order)) {
      sortedFields[field] = order as "asc" | "desc";
    }
  });
  return sortedFields;
};

const convertSortedFieldsToQueryString = (sortedFields: SortedFields): string => {
  let sortQueryString = "";
  Object.keys(sortedFields).forEach(
    sortedField => (sortQueryString += `&sort=${sortedField},${sortedFields[sortedField]}`),
  );
  return sortQueryString;
};

const MasterContainer = (props: Props): JSX.Element => {
  const [currentPage, setCurrentPage] = useState<number>(getCurrentPage(props.query));
  const [currentSortedFields, setCurrentSortedFields] = useState<SortedFields>(getCurrentSortedFields(props.query));

  const pagination = usePagination({
    pageQueryString: "_page",
    sizeQueryString: "_limit",
    maxPagePropertyPath: "pageAmount",
    currentPage,
    size,
  });

  const sorting = useSorting({
    sortQueryString: "_sort",
    orderQueryString: "_order",
    currentSortedFields,
  });

  const interceptDataFetchingResponse = useCallback((response: Response): Response => {
    const urlParams = new URLSearchParams(response.config.url.substr(response.config.url.indexOf("?")));
    response.data = {
      content: response.data,
      page: parseInt(urlParams.get("_page")),
      pageAmount: Math.ceil(parseInt(response.headers["x-total-count"]) / size),
    };
    return response;
  }, []);

  const onDataFetchingPageChange = useCallback((page: number) => setCurrentPage(page), []);

  const onDataFetchingSortedFieldsChange = useCallback(
    (sortedFields: SortedFields) => setCurrentSortedFields(sortedFields),
    [],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(location.search);
      let valid = true;

      if (parseInt(urlParams.get("page")) !== currentPage) {
        valid = false;
      }

      if (Object.keys(currentSortedFields).length > 0) {
        if (urlParams.getAll("sort").length !== Object.keys(currentSortedFields).length) {
          valid = false;
        } else {
          urlParams.getAll("sort").find(value => {
            const [field, order] = value.split(",");
            if (currentSortedFields[field] !== order) {
              valid = false;
              return true;
            }
          });
        }
      } else if (urlParams.has("sort")) {
        valid = false;
      }

      if (!valid) {
        Router.replace(
          "/",
          `${location.origin}?page=${currentPage}${convertSortedFieldsToQueryString(currentSortedFields)}`,
        );
      }
    }
  }, [currentPage, currentSortedFields]);

  return (
    <Master
      title={props.title}
      dataFetchingResourceUrl={`${process.env.API_BASE_URL}${props.dataFetchingResourcePath}`}
      dataFetchingPagination={pagination}
      dataFetchingSorting={sorting}
      dataFetchingPropertyPath="content"
      newInstanceFetchingResourceUrl={`${process.env.API_BASE_URL}${props.newInstanceFetchingResourcePath}`}
      updateInstanceFetchingResourceUrl={`${process.env.API_BASE_URL}${props.updateInstanceFetchingResourcePath}`}
      deleteInstanceFetchingResourceUrl={`${process.env.API_BASE_URL}${props.deleteInstanceFetchingResourcePath}`}
      interceptDataFetchingResponse={interceptDataFetchingResponse}
      onDataFetchingPageChange={onDataFetchingPageChange}
      onDataFetchingSortedFieldsChange={onDataFetchingSortedFieldsChange}
      onDataFetchingRequestError={e => console.log(e)}
    >
      {props.children}
    </Master>
  );
};

export default MasterContainer;
