import React, { useCallback, ChangeEvent } from "react";
import { Form, Row, Col, Badge } from "react-bootstrap";
import { ArrowDownIcon } from "@primer/octicons-react";
import { createField } from "./BaseField";

interface Value {
  min: number;
  max: number;
}

interface RestPropertyName {
  min: string;
  max: string;
}

interface Placeholder {
  min: string;
  max: string;
}

const RangeNumberField = createField<Value, {}, RestPropertyName, Placeholder>(
  props => {
    const onChangeMin = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        props.onChange({ min: e.target.valueAsNumber, max: props.value?.max });
      },
      [props.value],
    );

    const onChangeMax = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        props.onChange({ min: props.value?.min, max: e.target.valueAsNumber });
      },
      [props.value],
    );

    return (
      <Row>
        <Col md={5}>
          <Form.Control
            type="number"
            autoComplete={props.inputAutoComplete ? "on" : "off"}
            placeholder={props.inputPlaceholder?.min}
            value={props.value?.min}
            onChange={onChangeMin}
          />
        </Col>
        <Col className="text-center py-1" md={2}>
          <span className="d-none d-md-inline">-</span>
          <span className="d-inline d-sm-none">
            <ArrowDownIcon verticalAlign="middle" size={16} />
          </span>
        </Col>
        <Col md={5}>
          <Form.Control
            type="number"
            autoComplete={props.inputAutoComplete ? "on" : "off"}
            placeholder={props.inputPlaceholder?.max}
            value={props.value?.max}
            onChange={onChangeMax}
          />
        </Col>
      </Row>
    );
  },
  props => {
    if (props.propertyName) {
      return (
        <Badge variant="secondary">
          <Badge variant="light">{props.datum[props.restPropertyName.min]}</Badge>
          <span>-</span>
          <Badge variant="light">{props.datum[props.restPropertyName.max]}</Badge>
        </Badge>
      );
    }
    return null;
  },
);

export default RangeNumberField;
