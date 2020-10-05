import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  Ref,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";
import axios, { AxiosResponse } from "axios";
import { MasterFactoryContext } from "../../master/Master";
import DataTable, { Datum, SortedFields } from "../DataTable";
import { PaginationComponent, Pagination as RemoteDataTablePagination } from "./util/Pagination";
import { Sorting as RemoteDateSorting } from "./util/Sorting";
import { throwRemoteResponseError } from "../../util/Error";

export type Response = AxiosResponse;

interface Props {
  columns: { [propertyName: string]: string };
  dataResourceHeaders: { [key: string]: string };
  dataResourceUrl: string;
  dataPropertyPath: string;
  pagination: RemoteDataTablePagination;
  sorting: RemoteDateSorting;
  selectable: boolean;
  noDataAvailableLabel?: string;
  actionLabel: string;
  sortLabel: string;
  sortAscLabel: string;
  sortDescLabel: string;
  addNewFilterLabel: string;
  customRenderCell: (datum: Datum, propertyName: string) => ReactNode;
  renderAction: (datum: Datum) => ReactNode;
  interceptResponse: (response: Response) => Response;
  onPageChange: (page: number, size: number) => void;
  onSortedFieldsChange: (sortedFields: SortedFields) => void;
  onError: (error: Error) => void;
  onSelectedDataChange: (data: Datum[]) => void;
}

export interface RemoteDataTableRef {
  reload: () => void;
}

const LoadingContainer = styled.div`
  background: rgba(0, 0, 0, 0.5);
`;

const RemoteDataTable = (props: Partial<Props>, ref: Ref<RemoteDataTableRef>): JSX.Element => {
  const [data, setData] = useState<Datum[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [lastLoadedDataResourceUrl, setLastLoadedDataResourceUrl] = useState<string>();
  const masterFactory = useContext(MasterFactoryContext);

  const loadData = useCallback(async () => {
    if (props.dataResourceUrl) {
      try {
        const dataResourceUrl =
          props.sorting?.sortingDataResourceUrl || props.pagination?.paginatedDataResourceUrl || props.dataResourceUrl;
        if (lastLoadedDataResourceUrl !== dataResourceUrl) {
          setLoading(true);
          const response = props.interceptResponse(
            await axios.get(dataResourceUrl, { headers: props.dataResourceHeaders }),
          );
          if (response.data) {
            let responseData = response.data;
            if (props.dataPropertyPath) {
              responseData = props.dataPropertyPath
                .split(".")
                .reduce((parent, propertyName) => parent[propertyName], responseData);
            }
            if (props.pagination) {
              const page = props.pagination.pagePropertyPath
                .split(".")
                .reduce((parent, propertyName) => parent[propertyName], response.data);
              const maxPage = props.pagination.maxPagePropertyPath
                .split(".")
                .reduce((parent, propertyName) => parent[propertyName], response.data);
              if (page) {
                props.pagination.setPage(page);
              }
              if (maxPage) {
                props.pagination.setMaxPage(maxPage);
              }
            }
            if (Array.isArray(responseData)) {
              setData(responseData);
              setLastLoadedDataResourceUrl(dataResourceUrl);
            } else {
              throwRemoteResponseError("dataPropertyPath", props.dataPropertyPath, responseData);
            }
          }
        }
      } catch (e) {
        props.onError(e);
      }
      setLoading(false);
    }
  }, [props.dataResourceHeaders, props.dataResourceUrl, props.pagination, props.sorting]);

  const onSortedFieldChange = useCallback((sortedFields: SortedFields) => {
    props.sorting?.setSortedFields(sortedFields);
  }, []);

  useEffect(() => {
    props.pagination?.setDataResourceUrl(props.dataResourceUrl);
    props.sorting?.setDataResourceUrl(props.pagination?.paginatedDataResourceUrl || props.dataResourceUrl);
    if (
      !props.sorting ||
      !props.pagination ||
      (props.sorting &&
        props.sorting?.sortingDataResourceUrl &&
        props.sorting?.sortingDataResourceUrl !== props.dataResourceUrl) ||
      (!props.sorting &&
        props.pagination?.paginatedDataResourceUrl &&
        props.pagination?.paginatedDataResourceUrl !== props.dataResourceUrl)
    ) {
      loadData();
    }
  }, [props.dataResourceUrl, props.pagination?.paginatedDataResourceUrl, props.sorting?.sortingDataResourceUrl]);

  useEffect(() => {
    if (props.pagination) {
      props.onPageChange(props.pagination.page, props.pagination.size);
    }
  }, [props.pagination?.page, props.pagination?.size]);

  useEffect(() => {
    if (props.sorting) {
      props.onSortedFieldsChange(props.sorting.sortedFields);
    }
  }, [props.sorting?.sortedFields]);

  useEffect(() => {
    props.sorting?.setMasterFactory(masterFactory);
  }, [masterFactory]);

  useImperativeHandle(
    ref,
    (): RemoteDataTableRef => ({
      reload: () => loadData(),
    }),
  );

  return (
    <>
      <div className="position-relative">
        <DataTable
          columns={props.columns}
          data={data}
          sortedFields={props.sorting?.sortedFields}
          selectable={props.selectable}
          sortable={props.sorting != null}
          noDataAvailableLabel={props.noDataAvailableLabel}
          actionLabel={props.actionLabel}
          sortLabel={props.sortLabel}
          sortAscLabel={props.sortAscLabel}
          sortDescLabel={props.sortDescLabel}
          customRenderCell={props.customRenderCell}
          renderAction={props.renderAction}
          onSelectedDataChange={props.onSelectedDataChange}
          onSortedFieldChange={onSortedFieldChange}
        />
        {isLoading && (
          <LoadingContainer className="position-absolute m-auto fixed-top fixed-bottom">
            <Spinner
              className="position-absolute m-auto fixed-top fixed-bottom"
              animation="border"
              variant="light"
              role="status"
            />
          </LoadingContainer>
        )}
      </div>
      <PaginationComponent className="float-right" pagination={props.pagination} visible={data.length > 0} />
    </>
  );
};

const RemoteDataTableWithRef = forwardRef<RemoteDataTableRef, Partial<Props>>(RemoteDataTable);

const defaultProps: Partial<Props> = {
  interceptResponse: response => response,
  onPageChange: () => {},
  onSortedFieldsChange: () => {},
  onError: () => {},
};
RemoteDataTableWithRef.defaultProps = defaultProps;

export default RemoteDataTableWithRef;
