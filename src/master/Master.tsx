import React, { ReactNode, ReactElement, Children, useCallback, useState, useRef, createContext } from "react";
import { Container, Button } from "react-bootstrap";
import styled from "styled-components";
import axios from "axios";
import { compile } from "path-to-regexp";
import { PencilIcon, TrashcanIcon } from "@primer/octicons-react";
import { Props as BaseFieldProps, Field } from "./form/field/BaseField";
import FormContainer, { Fields } from "./form/FormContainer";
import Header from "./header/Header";
import RemoteDataTable, { Response, RemoteDataTableRef } from "../datatable/remote/RemoteDataTable";
import { Pagination } from "../datatable/remote/util/Pagination";
import { Sorting } from "../datatable/remote/util/Sorting";
import { Datum, SortedFields } from "../datatable/DataTable";
import Message, { MessageRef } from "../message/Message";
import ModalContainer, { ModalContainerRef } from "../modal/ModalContainer";
import Confirm, { ConfirmRef } from "../modal/confirm/Confirm";

interface Props {
  title: string;
  children: ReactNode;
  dataFetchingResourceHeaders: { [key: string]: string };
  dataFetchingResourceUrl: string;
  dataFetchingPropertyPath: string;
  dataFetchingPagination: Pagination;
  dataFetchingSorting: Sorting;
  interceptDataFetchingResponse: (response: Response) => Response;
  onDataFetchingPageChange: (page: number, size: number) => void;
  onDataFetchingSortedFieldsChange: (sortedFields: SortedFields) => void;
  onDataFetchingRequestError: (error: Error) => void;
  newInstanceFetchingResourceUrl: string;
  onNewInstanceRequestError: (error: Error) => void;
  updateInstanceFetchingResourceUrl: string;
  onUpdateInstanceRequestError: (error: Error) => void;
  deleteInstanceFetchingResourceUrl: string;
  onDeleteInstanceRequestError: (error: Error) => void;
  loadingLabel: string;
  noDataAvailableLabel: string;
  actionLabel: string;
  sortLabel: string;
  sortAscLabel: string;
  sortDescLabel: string;
  addNewFilterLabel: string;
  saveButtonLabel: string;
  addNewButtonLabel: string;
  addNewFormTitle: string;
  updateFormTitle: string;
  deleteSelectedButtonLabel: string;
  deleteConfirmationTitle: string;
  deleteConfirmationMessage: { singular: string; plural: string };
  deleteConfirmationYesLabel: string;
  deleteConfirmationNoLabel: string;
  successToAddMessage: string;
  successToUpdateMessage: string;
  successToDeleteMessage: string;
  customRenderAction: (datum: Datum) => ReactNode;
}

export interface MasterFactory {
  childrenProps?: BaseFieldProps[];
}

export const MasterFactoryContext = createContext<MasterFactory>({});

const Actions = styled.div`
  width: 75px;
`;

const composeColumns = (childrenProps: BaseFieldProps[]): { [restPropertyName: string]: string } => {
  const result = {};
  childrenProps
    .filter(({ showOnDataTable }) => showOnDataTable)
    .forEach(({ label, propertyName }) => {
      result[propertyName] = label;
    });
  return result;
};

const compileFromUrl = (url: string, datum: Datum): string => {
  const { origin, pathname } = new URL(url);
  const buildPath = compile(pathname, { encode: encodeURIComponent });

  return `${origin}${buildPath(datum)}`;
};

const Master = (props: Props): JSX.Element => {
  const [editableDatum, setEditableDatum] = useState<Datum>();
  const [selectedData, setSelectedData] = useState<Datum[]>([]);
  const remoteDataTable = useRef<RemoteDataTableRef>();
  const formModal = useRef<ModalContainerRef>();
  const confirm = useRef<ConfirmRef>();
  const message = useRef<MessageRef>();
  const childrenProps = Children.map(props.children, (field: ReactElement) => field.props as BaseFieldProps);
  const tableCellComponents = Children.map(props.children, (field: ReactElement) => ({
    propertyName: (field.props as BaseFieldProps).propertyName,
    TableCellComponent: (field.type as Field).TableCellComponent,
  }));

  const openForm = useCallback((datum?: Datum | Event) => {
    formModal.current.show();
    if (typeof datum.preventDefault !== "function") {
      setEditableDatum(datum);
    }
  }, []);

  const closeForm = useCallback(() => {
    setEditableDatum(null);
  }, []);

  const onSubmit = useCallback(
    async (fields: Fields): Promise<void> => {
      const request = !editableDatum ? axios.post : axios.put;
      try {
        await request(
          !editableDatum
            ? props.newInstanceFetchingResourceUrl
            : compileFromUrl(props.updateInstanceFetchingResourceUrl, editableDatum),
          fields,
        );
        formModal.current.hide();
        remoteDataTable.current.reload();
        message.current.show({
          content: !editableDatum ? props.successToAddMessage : props.successToUpdateMessage,
          type: "success",
        });
        setEditableDatum(null);
      } catch (e) {
        message.current.show({
          content: e.message || e,
          type: "danger",
        });
        !editableDatum ? props.onNewInstanceRequestError(e) : props.onUpdateInstanceRequestError(e);
      }
    },
    [editableDatum],
  );

  const deleteData = useCallback((data: Datum[]): void => {
    if (data.length > 0) {
      confirm.current.show({
        title: props.deleteConfirmationTitle,
        message: data.length === 1 ? props.deleteConfirmationMessage.singular : props.deleteConfirmationMessage.plural,
        type: "danger",
        onYesButtonClick: async () => {
          try {
            const promises = data.map(datum =>
              axios.delete(compileFromUrl(props.deleteInstanceFetchingResourceUrl, datum)),
            );
            await Promise.all(promises);
            remoteDataTable.current.reload();
            message.current.show({
              content: props.successToDeleteMessage,
              type: "success",
            });
          } catch (e) {
            message.current.show({
              content: e.message || e,
              type: "danger",
            });
            props.onDeleteInstanceRequestError(e);
          }
        },
      });
    }
  }, []);

  const deleteAllSelectedData = useCallback(async (): Promise<void> => {
    deleteData(selectedData);
    setSelectedData([]);
  }, [selectedData]);

  const customRenderCell = useCallback((datum: Datum, propertyName: string): ReactNode => {
    const childProps = childrenProps.find(childProps => childProps.propertyName === propertyName);
    if (childProps.customRenderCell) {
      return childProps.customRenderCell(datum);
    } else {
      const TableCellComponent = tableCellComponents.find(
        tableCellComponent => tableCellComponent.propertyName === propertyName,
      )?.TableCellComponent;
      if (TableCellComponent) {
        return (
          <TableCellComponent
            {...childProps}
            datum={datum}
            propertyName={propertyName}
            restPropertyName={childProps.restPropertyName}
          />
        );
      }
    }
    return null;
  }, []);

  const renderAction = useCallback(
    (datum: Datum): ReactNode => {
      if (props.customRenderAction) {
        const action = props.customRenderAction(datum);
        if (action) {
          return action;
        }
      }

      return (
        <Actions className="text-center mx-auto">
          <Button className="mr-1" variant="outline-primary" size="sm" onClick={() => openForm(datum)}>
            <PencilIcon verticalAlign="middle" size={16} />
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => deleteData([datum])}>
            <TrashcanIcon verticalAlign="middle" size={16} />
          </Button>
        </Actions>
      );
    },
    [props.customRenderAction],
  );

  const onSelectedDataChange = useCallback((data: Datum[]) => setSelectedData(data), []);

  return (
    <MasterFactoryContext.Provider value={{ childrenProps }}>
      <Container>
        <Header
          title={props.title}
          deleteSelectedButtonLabel={props.deleteSelectedButtonLabel}
          addNewButtonLabel={props.addNewButtonLabel}
          showDeleteSelectedButton={selectedData.length > 0}
          onDeleteSelectedButtonClick={deleteAllSelectedData}
          onAddNewButtonClick={openForm}
        />
        <RemoteDataTable
          ref={remoteDataTable}
          dataResourceHeaders={props.dataFetchingResourceHeaders}
          dataResourceUrl={props.dataFetchingResourceUrl}
          dataPropertyPath={props.dataFetchingPropertyPath}
          pagination={props.dataFetchingPagination}
          sorting={props.dataFetchingSorting}
          selectable
          noDataAvailableLabel={props.noDataAvailableLabel}
          actionLabel={props.actionLabel}
          sortLabel={props.sortLabel}
          sortAscLabel={props.sortAscLabel}
          sortDescLabel={props.sortDescLabel}
          addNewFilterLabel={props.addNewFilterLabel}
          columns={composeColumns(childrenProps)}
          customRenderCell={customRenderCell}
          renderAction={renderAction}
          interceptResponse={props.interceptDataFetchingResponse}
          onPageChange={props.onDataFetchingPageChange}
          onSortedFieldsChange={props.onDataFetchingSortedFieldsChange}
          onError={props.onDataFetchingRequestError}
          onSelectedDataChange={onSelectedDataChange}
        />
        <ModalContainer
          ref={formModal}
          size="lg"
          title={!editableDatum ? props.addNewFormTitle : props.updateFormTitle}
          onHide={closeForm}
        >
          <FormContainer
            datum={editableDatum}
            loadingLabel={props.loadingLabel}
            saveButtonLabel={props.saveButtonLabel}
            onSubmit={onSubmit}
          >
            {props.children}
          </FormContainer>
        </ModalContainer>
        <Confirm ref={confirm} />
        <Message ref={message} />
      </Container>
    </MasterFactoryContext.Provider>
  );
};

const defaultProps: Partial<Props> = {
  children: [],
  loadingLabel: "Loading",
  addNewFormTitle: "Add New Item",
  updateFormTitle: "Update Item",
  deleteConfirmationTitle: "Delete Item",
  deleteConfirmationMessage: {
    singular: "Are you sure to delete this item?",
    plural: "Are you sure to delete these items?",
  },
  successToAddMessage: "Success to add new instance",
  successToUpdateMessage: "Success to update instance",
  successToDeleteMessage: "Success to delete instance(s)",
  onNewInstanceRequestError: () => {},
  onUpdateInstanceRequestError: () => {},
  onDeleteInstanceRequestError: () => {},
};
Master.defaultProps = defaultProps;

export default Master;
