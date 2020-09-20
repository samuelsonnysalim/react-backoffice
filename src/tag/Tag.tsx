import React from "react";
import { Badge } from "react-bootstrap";
import styled from "styled-components";
import { XCircleFillIcon } from "@primer/octicons-react";

export interface Props {
  content: string;
  operator: string;
  subContent: string;
}

const TagContainer = styled.a`
  display: inline-block;
  cursor: pointer;
  margin-right: 0.5rem;
  :last-child {
    margin-right: 0;
  }
`;

const TagContent = styled.span`
  font-size: 14px;
`;

const Operator = styled.span`
  color: #ffd70d;
`;

const Tag = (props: Partial<Props>): JSX.Element => (
  <TagContainer>
    <Badge variant="primary">
      <TagContent>
        {props.content}
        {props.operator && <Operator className="ml-1">{props.operator}</Operator>}
        {props.subContent && (
          <>
            <Badge className="ml-1" variant="light">
              <TagContent>{props.subContent}</TagContent>
            </Badge>
          </>
        )}
      </TagContent>
      <XCircleFillIcon className="ml-1 text-light" size={16} />
    </Badge>
  </TagContainer>
);

export default Tag;
