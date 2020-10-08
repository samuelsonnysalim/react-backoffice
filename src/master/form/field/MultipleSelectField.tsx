import React, { useCallback } from "react";
import { Badge } from "react-bootstrap";
import Select from "react-select";
import { createField, InputFieldProps, TableCellProps } from "./BaseField";

interface Props {
  options?: { value: string; label: string }[];
}

export const InputFieldComponent = (props: InputFieldProps<string[], string, string> & Props): JSX.Element => {
  const onChange = useCallback(
    (selectedOptions: { value: string; label: string }[]) => props.onChange(selectedOptions?.map(({ value }) => value)),
    [],
  );

  return (
    <Select
      options={props.options}
      isMulti
      placeholder={props.inputPlaceholder}
      value={props.options?.filter(({ value }) => props.value?.includes(value))}
      onChange={onChange}
    />
  );
};

export const TableCellComponent = (props: TableCellProps<string> & Props): JSX.Element => {
  const value = props.datum[props.restPropertyName || props.propertyName] as string[];
  const selectedOptions = props.options?.filter(option => value?.includes(option.value));
  return (
    <>
      {selectedOptions?.map(({ label }, index) => (
        <Badge key={index} variant="secondary" className="mr-1">
          {label}
        </Badge>
      ))}
    </>
  );
};

const MultipleSelectField = createField<string[], Props>(InputFieldComponent, TableCellComponent);

export default MultipleSelectField;
