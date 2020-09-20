import React from "react";
import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";
import { parse, parseJSON, format } from "date-fns";
import { createField } from "./BaseField";

interface Props {
  format?: string;
  parseFormat?: string;
}

const DateField = createField<Date, Props>(
  props => {
    return (
      <DatePicker
        wrapperClassName="d-block"
        customInput={<Form.Control type="text" />}
        autoComplete="off"
        dateFormat={props.format || "dd MMM yyyy"}
        placeholderText={props.inputPlaceholder}
        selected={
          !props.value || typeof props.value !== "string"
            ? props.value
            : props.parseFormat
            ? parse(props.value as string, props.parseFormat, null)
            : parseJSON(props.value)
        }
        onChange={props.onChange}
        onChangeRaw={e => e.preventDefault()}
      />
    );
  },
  props => {
    const value = props.datum[props.restPropertyName || props.propertyName] as string;
    return (
      <>
        {format(
          props.parseFormat ? parse(value, props.parseFormat, null) : parseJSON(value),
          props.format || "dd MMM yyyy",
        )}
      </>
    );
  },
);

export default DateField;
