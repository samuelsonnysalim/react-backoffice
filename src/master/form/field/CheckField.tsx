import React, { useCallback, ChangeEvent } from "react";
import { Form, Badge } from "react-bootstrap";
import { createField, InputFieldProps, TableCellProps } from "./BaseField";

interface Props {
  options?: { value: string; label: string }[];
}

export const InputFieldComponent = (props: InputFieldProps<string[], string, string> & Props): JSX.Element => {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const currentValue = props.value || [];
      if (e.target.checked) {
        currentValue.push(e.target.value);
      } else {
        currentValue.splice(
          currentValue.findIndex(value => value === e.target.value),
          1,
        );
      }
      props.onChange([...currentValue]);
    },
    [props.value],
  );

  return (
    <>
      {props.options?.map(({ value, label }, index) => (
        <Form.Check
          key={index}
          type="checkbox"
          id={`${props.propertyName}.${value}`}
          name={props.propertyName}
          label={label}
          value={value}
          checked={props.value?.includes(value)}
          onChange={onChange}
        />
      ))}
    </>
  );
};

export const TableCellComponent = (props: TableCellProps<string> & Props): JSX.Element => {
  const value = props.datum[props.restPropertyName || props.propertyName] as string[];
  const selectedOptions = props.options?.filter(option => value.includes(option.value));
  return (
    <>
      {selectedOptions?.map(({ label }, index) => (
        <Badge key={index} variant="secondary">
          {label}
        </Badge>
      ))}
    </>
  );
};

const CheckField = createField<string[], Props>(InputFieldComponent, TableCellComponent);

export default CheckField;
