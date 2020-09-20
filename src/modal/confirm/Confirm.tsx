import React, { forwardRef, Ref, useState, useRef, useImperativeHandle, useCallback } from "react";
import ModalContainer, { ModalContainerRef } from "../ModalContainer";
import { Row, Col, Button } from "react-bootstrap";

interface Options {
  title: string;
  message: string;
  yesLabel: string;
  noLabel: string;
  type: "primary" | "danger";
  onYesButtonClick: () => void;
  onNoButtonClick: () => void;
}

export interface ConfirmRef {
  show: (options: Partial<Options>) => void;
  hide: () => void;
}

const Confirm = (_, ref: Ref<ConfirmRef>): JSX.Element => {
  const [options, setOptions] = useState<Partial<Options>>();
  const modal = useRef<ModalContainerRef>();

  const onYes = useCallback(() => {
    if (options?.onYesButtonClick) {
      options?.onYesButtonClick();
    }
    modal.current.hide();
  }, [options?.onYesButtonClick]);

  const onNo = useCallback(() => {
    if (options?.onNoButtonClick) {
      options?.onNoButtonClick();
    }
    modal.current.hide();
  }, [options?.onNoButtonClick]);

  useImperativeHandle(
    ref,
    (): ConfirmRef => ({
      show: options => {
        setOptions(options);
        modal.current.show();
      },
      hide: () => modal.current.hide(),
    }),
  );

  return (
    <ModalContainer ref={modal} title={options?.title}>
      {options?.message}
      <Row className="mt-3">
        <Col xs={6}>
          <Button variant={options?.type === "primary" ? "outline-primary" : "outline-danger"} block onClick={onNo}>
            {options?.noLabel || "No"}
          </Button>
        </Col>
        <Col xs={6}>
          <Button variant={options?.type || "primary"} block onClick={onYes}>
            {options?.yesLabel || "Yes"}
          </Button>
        </Col>
      </Row>
    </ModalContainer>
  );
};

export default forwardRef<ConfirmRef>(Confirm);
