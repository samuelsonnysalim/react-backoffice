import {
  InputFieldComponent as MultipleSelectFieldInputComponent,
  TableCellComponent as MultipleSelectFieldTableCellComponent,
} from "./MultipleSelectField";
import { createRemoteLabelValueCollectionField } from "./BaseRemoteLabelValueCollectionField";

const RemoteMultipleSelectField = createRemoteLabelValueCollectionField(
  MultipleSelectFieldInputComponent,
  MultipleSelectFieldTableCellComponent,
);

export default RemoteMultipleSelectField;
