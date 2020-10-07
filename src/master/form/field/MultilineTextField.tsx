import React, { useCallback, ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import { createField } from "./BaseField";

interface Props {
  useRichtext?: boolean;
}

const ReactQuill = typeof window !== "undefined" ? require("react-quill") : null;
const ReactQuillContainer = styled.div`
  .ql-container {
    min-height: 75px;
  }
`;

const MultilineTextField = createField<string, Props>(props => {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value), []);

  return !props.useRichtext ? (
    <Form.Control
      as="textarea"
      autoComplete={props.inputAutoComplete ? "on" : "off"}
      placeholder={props.inputPlaceholder}
      rows={3}
      value={props.value}
      onChange={onChange}
    />
  ) : (
    ReactQuill && (
      <ReactQuillContainer>
        <ReactQuill
          theme="snow"
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
              ["link", "image"],
              ["clean"],
            ],
          }}
          value={props.value}
          onChange={value => props.onChange(value)}
        />
      </ReactQuillContainer>
    )
  );
});

export default MultilineTextField;
