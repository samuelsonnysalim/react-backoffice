import React from "react";
import { Button } from "react-bootstrap";
import { PlusCircleIcon } from "@primer/octicons-react";
import Tag, { Props as TagData } from "../Tag";

interface Props {
  tags: Partial<TagData>[];
  addNewLabel: string;
  onAddNewButtonClick: () => void;
}

const TagList = (props: Props): JSX.Element => {
  return (
    <div className="mb-3">
      <Button variant="link" onClick={props.onAddNewButtonClick}>
        <PlusCircleIcon className="mr-2" verticalAlign="middle" size={16} />
        {props.addNewLabel}
      </Button>
      {props.tags.map((tag, index) => (
        <Tag key={index} {...tag} />
      ))}
    </div>
  );
};

const defaultProps: Partial<Props> = {
  tags: [],
  addNewLabel: "Add New",
  onAddNewButtonClick: () => {},
};
TagList.defaultProps = defaultProps;

export default TagList;
