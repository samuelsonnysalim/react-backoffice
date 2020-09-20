import React, { ReactNode, useState, forwardRef, Ref, useImperativeHandle, useEffect, useCallback } from "react";
import { Modal } from "react-bootstrap";

interface Props {
  size: "sm" | "lg" | "xl";
  title: string;
  children: ReactNode;
  onHide: () => void;
}

export interface ModalContainerRef {
  show: () => void;
  hide: () => void;
}

const ModalContainer = (props: Props, ref: Ref<ModalContainerRef>): JSX.Element => {
  const [isVisible, setVisible] = useState<boolean>();

  const onHide = useCallback(() => setVisible(false), []);

  useImperativeHandle(
    ref,
    (): ModalContainerRef => ({
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }),
  );

  useEffect(() => {
    if (isVisible === false) {
      props.onHide();
    }
  }, [isVisible]);

  return (
    <Modal size={props.size} show={isVisible} animation onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};

const ModalContainerWithRef = forwardRef<ModalContainerRef, Partial<Props>>(ModalContainer);

const defaultProps: Partial<Props> = {
  size: "sm",
  onHide: () => {},
};
ModalContainerWithRef.defaultProps = defaultProps;

export default ModalContainerWithRef;
