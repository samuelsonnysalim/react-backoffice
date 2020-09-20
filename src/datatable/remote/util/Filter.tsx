import React from "react";
import TagList from "../../../tag/list/TagList";

interface Props {
  addNewFilterLabel: string;
}

const FilterComponent = (props: Props): JSX.Element => {
  return (
    <TagList
      addNewLabel={props.addNewFilterLabel}
      tags={[
        {
          content: "ID",
          operator: "=",
          subContent: "1",
        },
        {
          content: "Nama",
          operator: "contains",
          subContent: "Samuel",
        },
        {
          content: "Age",
          operator: ">",
          subContent: "17",
        },
      ]}
    />
  );
};

const defaultProps: Partial<Props> = {
  addNewFilterLabel: "Add New Filter",
};
FilterComponent.defaultProps = defaultProps;

export default FilterComponent;
