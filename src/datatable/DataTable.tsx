import React, { ReactNode, useState, useCallback, ChangeEvent, useEffect } from "react";
import { Table } from "react-bootstrap";
import styled from "styled-components";
import { UnfoldIcon, FoldDownIcon, FoldUpIcon } from "@primer/octicons-react";
import TooltipContainer from "../tooltip/TooltipContainer";

export interface Datum {
  [key: string]: any;
}

export interface SortedFields {
  [propertyName: string]: "asc" | "desc";
}

interface Props {
  columns: { [propertyName: string]: string };
  data: Datum[];
  sortedFields: SortedFields;
  selectable: boolean;
  sortable: boolean;
  noDataAvailableLabel: string;
  actionLabel: string;
  sortLabel: string;
  sortAscLabel: string;
  sortDescLabel: string;
  customRenderCell: (datum: Datum, propertyName: string) => ReactNode;
  renderAction: (datum: Datum) => ReactNode;
  onSelectedDataChange: (data: Datum[]) => void;
  onSortedFieldChange: (sortedFields: SortedFields) => void;
}

const RelativeTableHead = styled.th`
  position: relative;
`;

const RelativeTableData = styled.td`
  position: relative;
`;

const CheckboxContainer = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
`;

const Checkbox = styled.input.attrs(() => ({ type: "checkbox" }))`
  height: 100%;
  cursor: pointer;
`;

const HeaderCellContent = styled.a`
  position: relative;
  display: block;
  padding-right: 20px;
  line-height: 16px;
  cursor: pointer;
`;

const HeaderCellContentSort = styled.span`
  position: absolute;
  display: block;
  width: 16px;
  height: 16px;
  right: 0;
  bottom: 0;
`;

const DataTable = (props: Props): JSX.Element => {
  const [sortedFields, setSortedFields] = useState<SortedFields>(props.sortedFields);
  const [selectedData, setSelectedData] = useState<Datum[]>([]);

  const selectAllData = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSelectedData(e.target.checked ? [...props.data] : []),
    [props.data],
  );

  const selectDatum = useCallback(
    (e: ChangeEvent<HTMLInputElement>, datum: Datum) => {
      if (e.target.checked) {
        setSelectedData([...selectedData, datum]);
      } else {
        selectedData.splice(
          selectedData.findIndex(selectedDatum => selectedDatum === datum),
          1,
        );
        setSelectedData([...selectedData]);
      }
    },
    [selectedData],
  );

  const sortField = useCallback(
    (propertyName: string) => {
      if (props.sortable) {
        const order = sortedFields[propertyName];
        if (!order) {
          setSortedFields({ ...sortedFields, [propertyName]: "asc" });
        } else if (order === "asc") {
          setSortedFields({ ...sortedFields, [propertyName]: "desc" });
        } else if (order === "desc") {
          delete sortedFields[propertyName];
          setSortedFields({ ...sortedFields });
        }
      }
    },
    [props.sortable, sortedFields],
  );

  useEffect(() => {
    setSelectedData([]);
  }, [props.data]);

  useEffect(() => {
    props.onSelectedDataChange(selectedData);
  }, [selectedData]);

  useEffect(() => {
    props.onSortedFieldChange(sortedFields);
  }, [sortedFields]);

  useEffect(() => {
    setSortedFields(props.sortedFields);
  }, [props.sortedFields]);

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            {props.selectable && (
              <RelativeTableHead>
                <CheckboxContainer>
                  <Checkbox
                    className="form-control"
                    checked={selectedData.length === props.data.length && selectedData.length > 0}
                    onChange={selectAllData}
                  />
                </CheckboxContainer>
              </RelativeTableHead>
            )}
            {Object.keys(props.columns).map((propertyName, colIndex) => {
              const order = sortedFields[propertyName];
              return (
                <th key={colIndex}>
                  <TooltipContainer
                    enabled={props.sortable}
                    message={!order ? props.sortLabel : order === "asc" ? props.sortAscLabel : props.sortDescLabel}
                  >
                    <HeaderCellContent
                      className={order ? "text-primary" : null}
                      onClick={() => sortField(propertyName)}
                    >
                      {props.columns[propertyName]}
                      {props.sortable && (
                        <HeaderCellContentSort>
                          {!order ? (
                            <UnfoldIcon className="d-block" verticalAlign="middle" size={16} />
                          ) : order === "asc" ? (
                            <FoldDownIcon verticalAlign="middle" size={16} />
                          ) : (
                            <FoldUpIcon verticalAlign="middle" size={16} />
                          )}
                        </HeaderCellContentSort>
                      )}
                    </HeaderCellContent>
                  </TooltipContainer>
                </th>
              );
            })}
            {props.renderAction && <th>{props.actionLabel}</th>}
          </tr>
        </thead>
        <tbody>
          {props.data.map((datum, rowIndex) => (
            <tr key={rowIndex}>
              {props.selectable && (
                <RelativeTableData>
                  <CheckboxContainer>
                    <Checkbox
                      className="form-control"
                      checked={selectedData.find(selectedDatum => selectedDatum === datum) != null}
                      onChange={e => selectDatum(e, datum)}
                    />
                  </CheckboxContainer>
                </RelativeTableData>
              )}
              {Object.keys(props.columns).map((propertyName, colIndex) => (
                <td key={colIndex}>{props.customRenderCell(datum, propertyName) || datum[propertyName]}</td>
              ))}
              {props.renderAction && <td>{props.renderAction(datum)}</td>}
            </tr>
          ))}
        </tbody>
        {props.data.length === 0 && (
          <tfoot>
            <tr>
              <td
                className="bg-light text-secondary text-center font-italic"
                colSpan={Object.keys(props.columns).length + (props.selectable ? 1 : 0) + (props.renderAction ? 1 : 0)}
              >
                {props.noDataAvailableLabel}
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  );
};

const defaultProps: Partial<Props> = {
  columns: {},
  data: [],
  sortedFields: {},
  selectable: false,
  sortable: false,
  noDataAvailableLabel: "No Data Available",
  actionLabel: "Action",
  sortLabel: "Sort Field",
  sortAscLabel: "Sort Ascending",
  sortDescLabel: "Sort Descending",
  customRenderCell: () => null,
  onSelectedDataChange: () => {},
  onSortedFieldChange: () => {},
};
DataTable.defaultProps = defaultProps;

export default DataTable;
