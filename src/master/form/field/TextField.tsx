import React, { useCallback, ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { createField } from "./BaseField";

interface Props {
  type?: "email" | "password" | "search" | "tel" | "text" | "url";
}

const TextField = createField<string, Props>(props => {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      props.onChange(props.type === "tel" ? e.target.value.replace(/\D/, "") : e.target.value),
    [props.type],
  );

  return (
    <Form.Control
      type={props.type || "text"}
      autoComplete={props.inputAutoComplete ? "on" : "off"}
      placeholder={props.inputPlaceholder}
      value={props.value}
      onChange={onChange}
    />
  );
});

export default TextField;
