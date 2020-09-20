import React, { useCallback, ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { createField, InputFieldProps, TableCellProps } from "./BaseField";

interface Props {
  options?: { value: string; label: string }[];
}

export const InputFieldComponent = (props: InputFieldProps<string, string, string> & Props): JSX.Element => {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      props.onChange(e.target.value);
    }
  }, []);

  return (
    <>
      {props.options?.map(({ value, label }, index) => (
        <Form.Check
          key={index}
          type="radio"
          id={`${props.propertyName}.${value}`}
          name={props.propertyName}
          label={label}
          value={value}
          checked={value === props.value}
          onChange={onChange}
        />
      ))}
    </>
  );
};

export const TableCellComponent = (props: TableCellProps<string> & Props): JSX.Element => (
  <>{props.options?.find(({ value }) => value === props.datum[props.restPropertyName || props.propertyName])?.label}</>
);

const RadioField = createField<string, Props>(InputFieldComponent, TableCellComponent);

export default RadioField;
