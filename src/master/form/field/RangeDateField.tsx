import React, { useCallback } from "react";
import { Form, Row, Col, Badge } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { ArrowDownIcon } from "@primer/octicons-react";
import { parse, parseJSON, format } from "date-fns";
import { createField } from "./BaseField";

interface Value {
  min: Date;
  max: Date;
}

interface RestPropertyName {
  min: string;
  max: string;
}

interface Placeholder {
  min: string;
  max: string;
}

interface Props {
  format?: string;
  parseFormat?: string;
}

const RangeDateField = createField<Value, Props, RestPropertyName, Placeholder>(
  props => {
    const onChangeMin = useCallback((value: Date) => props.onChange({ min: value, max: props.value?.max }), [
      props.value,
    ]);

    const onChangeMax = useCallback(
      (value: Date) => {
        props.onChange({ min: props.value?.min, max: value });
      },
      [props.value],
    );

    return (
      <Row>
        <Col md={5}>
          <DatePicker
            wrapperClassName="d-block"
            customInput={<Form.Control type="text" />}
            autoComplete="off"
            dateFormat={props.format || "dd MMM yyyy"}
            placeholderText={props.inputPlaceholder?.min}
            selected={
              !props.value?.min || typeof props.value?.min !== "string"
                ? props.value?.min
                : props.parseFormat
                ? parse(props.value?.min as string, props.parseFormat, null)
                : parseJSON(props.value?.min)
            }
            onChange={onChangeMin}
            onChangeRaw={e => e.preventDefault()}
          />
        </Col>
        <Col className="text-center py-1" md={2}>
          <span className="d-none d-md-inline">-</span>
          <span className="d-inline d-sm-none">
            <ArrowDownIcon verticalAlign="middle" size={16} />
          </span>
        </Col>
        <Col md={5}>
          <DatePicker
            wrapperClassName="d-block"
            customInput={<Form.Control type="text" />}
            autoComplete="off"
            dateFormat={props.format || "dd MMM yyyy"}
            placeholderText={props.inputPlaceholder?.max}
            selected={
              !props.value?.max || typeof props.value?.max !== "string"
                ? props.value?.max
                : props.parseFormat
                ? parse(props.value?.max as string, props.parseFormat, null)
                : parseJSON(props.value?.max)
            }
            onChange={onChangeMax}
            onChangeRaw={e => e.preventDefault()}
          />
        </Col>
      </Row>
    );
  },
  props => {
    if (props.propertyName) {
      return (
        <Badge variant="secondary">
          <Badge variant="light">
            {format(
              props.parseFormat
                ? parse(props.datum[props.restPropertyName.min], props.parseFormat, null)
                : parseJSON(props.datum[props.restPropertyName.min]),
              props.format || "dd MMM yyyy",
            )}
          </Badge>
          <span>-</span>
          <Badge variant="light">
            {format(
              props.parseFormat
                ? parse(props.datum[props.restPropertyName.max], props.parseFormat, null)
                : parseJSON(props.datum[props.restPropertyName.max]),
              props.format || "dd MMM yyyy",
            )}
          </Badge>
        </Badge>
      );
    }
    return null;
  },
);

export default RangeDateField;
