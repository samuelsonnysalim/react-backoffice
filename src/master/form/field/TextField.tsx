import React, { useCallback, ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { createField } from "./BaseField";

const TextField = createField<string>(props => {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  }, []);

  return (
    <Form.Control
      type="text"
      autoComplete={props.inputAutoComplete ? "on" : "off"}
      placeholder={props.inputPlaceholder}
      value={props.value}
      onChange={onChange}
    />
  );
});

export default TextField;
