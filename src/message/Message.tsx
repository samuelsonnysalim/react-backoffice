import React, { forwardRef, Ref, useImperativeHandle, useState } from "react";
import { Toast } from "react-bootstrap";

interface MessageContent {
  content: string;
  type: "success" | "danger";
}

export interface MessageRef {
  show: (content: MessageContent) => void;
  hide: () => void;
}

const Message = (_, ref: Ref<MessageRef>): JSX.Element => {
  const [content, setContent] = useState<MessageContent>();
  const [isVisible, setVisible] = useState<boolean>(false);

  useImperativeHandle(
    ref,
    (): MessageRef => ({
      show: content => {
        setContent(content);
        setVisible(true);
        setTimeout(() => {
          setVisible(false);
        }, 3000);
      },
      hide: () => setVisible(false),
    }),
  );

  return (
    <Toast className="fixed-bottom mx-auto mb-5" style={{ zIndex: 9999 }} show={isVisible} animation>
      <Toast.Body
        className={`text-center ${content?.type.toLowerCase() === "success" ? "bg-success" : "bg-danger"} text-white`}
      >
        {content?.content}
      </Toast.Body>
    </Toast>
  );
};

export default forwardRef<MessageRef>(Message);
