import React, { useCallback, ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { createField } from "./BaseField";

const NumberField = createField<number>(props => {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.valueAsNumber);
  }, []);

  return (
    <Form.Control
      type="number"
      autoComplete={props.inputAutoComplete ? "on" : "off"}
      placeholder={props.inputPlaceholder}
      value={props.value}
      onChange={onChange}
    />
  );
});

export default NumberField;
