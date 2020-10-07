import React, { useCallback } from "react";
import Select from "react-select";
import { createField, InputFieldProps, TableCellProps } from "./BaseField";

interface Props {
  options?: { value: string; label: string }[];
}

export const InputFieldComponent = (props: InputFieldProps<string, string, string> & Props): JSX.Element => {
  const onChange = useCallback(({ value }: { value: string; label: string }) => props.onChange(value), []);

  return (
    <Select
      options={props.options}
      placeholder={props.inputPlaceholder}
      value={props.options?.find(({ value }) => value === props.value)}
      onChange={onChange}
    />
  );
};

export const TableCellComponent = (props: TableCellProps<string> & Props): JSX.Element => (
  <>{props.options?.find(({ value }) => value === props.datum[props.restPropertyName || props.propertyName])?.label}</>
);

const SelectField = createField<string, Props>(InputFieldComponent, TableCellComponent);

export default SelectField;
