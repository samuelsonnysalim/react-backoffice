import {
  InputFieldComponent as SelectFieldInputComponent,
  TableCellComponent as SelectFieldTableCellComponent,
} from "./SelectField";
import { createRemoteLabelValueCollectionField } from "./BaseRemoteLabelValueCollectionField";

const RemoteSelectField = createRemoteLabelValueCollectionField(
  SelectFieldInputComponent,
  SelectFieldTableCellComponent,
);

export default RemoteSelectField;
