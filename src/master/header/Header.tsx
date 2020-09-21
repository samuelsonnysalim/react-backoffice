import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { TrashcanIcon, PlusIcon } from "@primer/octicons-react";

interface Props {
  title: string;
  deleteSelectedButtonLabel: string;
  addNewButtonLabel: string;
  showDeleteSelectedButton: boolean;
  onDeleteSelectedButtonClick: () => void;
  onAddNewButtonClick: () => void;
}

const Header = (props: Props): JSX.Element => {
  return (
    <>
      <Row className="mt-3">
        <Col xs={7} md={9} lg={7}>
          <h1>{props.title}</h1>
        </Col>
        <Col xs={5} md={3} lg={5}>
          <Row className="mt-2" noGutters>
            <Col className="pr-1 pr-lg-2" xs={6} lg={6}>
              {props.showDeleteSelectedButton && (
                <Button variant="outline-danger" block onClick={props.onDeleteSelectedButtonClick}>
                  <TrashcanIcon verticalAlign="middle" size={16} />{" "}
                  <span className="d-none d-lg-inline">{props.deleteSelectedButtonLabel}</span>
                </Button>
              )}
            </Col>
            <Col className="pl-1 pl-lg-2" xs={6} lg={6}>
              <Button variant="primary" block onClick={props.onAddNewButtonClick}>
                <PlusIcon verticalAlign="middle" size={16} />{" "}
                <span className="d-none d-lg-inline">{props.addNewButtonLabel}</span>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <hr />
    </>
  );
};

const defaultProps: Partial<Props> = {
  addNewButtonLabel: "Add New",
  deleteSelectedButtonLabel: "Delete Selected",
  onDeleteSelectedButtonClick: () => {},
  onAddNewButtonClick: () => {},
};
Header.defaultProps = defaultProps;

export default Header;
