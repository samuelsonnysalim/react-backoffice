import React, { useState, ReactNode } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface Props {
  children: ReactNode;
  message: string;
  enabled: boolean;
}

const TooltipContainer = (props: Props): JSX.Element => {
  const [id] = useState<number>(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  return props.enabled ? (
    <OverlayTrigger placement="bottom" overlay={<Tooltip id={`${id}`}>{props.message}</Tooltip>}>
      {props.children}
    </OverlayTrigger>
  ) : (
    <>{props.children}</>
  );
};

const defaultProps: Partial<Props> = {
  enabled: true,
};
TooltipContainer.defaultProps = defaultProps;

export default TooltipContainer;
