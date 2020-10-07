import React, { ComponentType, useContext, useCallback, ReactNode, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import useForceUpdate from "use-force-update";
import { FormFactoryContext } from "../FormContainer";
import { Datum } from "../../../datatable/DataTable";

export interface Props<DataType = any, RestPropertyNameType = string, InputPlaceholderDataType = string> {
  label: string;
  propertyName: string;
  restPropertyName: RestPropertyNameType;
  inputPlaceholder: InputPlaceholderDataType;
  inputAutoComplete: boolean;
  showOnDataTable: boolean;
  showOnForm: boolean;
  inputValidation: (value: DataType) => string;
  customRenderCell: (datum: Datum) => ReactNode;
  customInboundRestParser: (value: any) => DataType;
  customOutboundRestParser: (value: DataType) => any;
}

export interface TableCellProps<RestPropertyNameType = string> {
  datum: Datum;
  propertyName: string;
  restPropertyName?: RestPropertyNameType;
}

export interface InputFieldProps<DataType, RestPropertyNameType, InputPlaceholderDataType>
  extends Partial<Props<DataType, RestPropertyNameType, InputPlaceholderDataType>> {
  value?: DataType;
  onChange: (value: DataType) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export interface Field<
  DataType = string,
  AdditionalProps = {},
  RestPropertyNameType = string,
  InputPlaceholderDataType = string
> {
  (props: Partial<Props<DataType, RestPropertyNameType, InputPlaceholderDataType>> & AdditionalProps): JSX.Element;
  defaultProps?: Partial<Props<DataType, RestPropertyNameType, InputPlaceholderDataType>>;
  TableCellComponent?: ComponentType<
    TableCellProps<RestPropertyNameType> &
      Props<DataType, RestPropertyNameType, InputPlaceholderDataType> &
      AdditionalProps
  >;
}

export const createField = <
  DataType extends any = string,
  AdditionalProps extends {} = {},
  RestPropertyNameType extends {} = string,
  InputPlaceholderDataType extends {} = string
>(
  InputFieldComponent: ComponentType<
    InputFieldProps<DataType, RestPropertyNameType, InputPlaceholderDataType> & AdditionalProps
  >,
  TableCellComponent?: ComponentType<
    TableCellProps<RestPropertyNameType> &
      Props<DataType, RestPropertyNameType, InputPlaceholderDataType> &
      AdditionalProps
  >,
): Field<DataType, AdditionalProps, RestPropertyNameType, InputPlaceholderDataType> => {
  const FieldComponent: Field<DataType, AdditionalProps, RestPropertyNameType, InputPlaceholderDataType> = props => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const formFactory = useContext(FormFactoryContext);
    const forceUpdate = useForceUpdate();

    const onChange = useCallback((value: DataType) => {
      formFactory?.setField<DataType, RestPropertyNameType>(
        props.propertyName,
        props.restPropertyName || (props.propertyName as any),
        value,
      );
    }, []);

    const onValueUpdated = useCallback(() => forceUpdate(), []);

    formFactory?.setRestParser(props.propertyName, props.customInboundRestParser, props.customOutboundRestParser);
    formFactory?.observe(props.propertyName, onValueUpdated);

    if (props.showOnForm) {
      const inboundRestParser = formFactory?.getInboundRestParsers<DataType>(props.propertyName);
      return (
        <Form.Group controlId={props.propertyName}>
          <Form.Label>{props.label}</Form.Label>
          {isLoading && (
            <div>
              <Spinner className="mr-2" animation="border" variant="primary" size="sm" role="status" />
              <span className="text-secondary">{formFactory?.loadingLabel}</span>
            </div>
          )}
          <InputFieldComponent
            {...props}
            value={
              inboundRestParser
                ? inboundRestParser(formFactory?.getField<DataType>(props.propertyName))
                : formFactory?.getField<DataType>(props.propertyName)
            }
            onChange={onChange}
            isLoading={isLoading}
            setLoading={setLoading}
          />
        </Form.Group>
      );
    }
    return null;
  };
  FieldComponent.defaultProps = {
    showOnDataTable: true,
    showOnForm: true,
  };
  FieldComponent.TableCellComponent = TableCellComponent;
  return FieldComponent;
};

export default { createField };
