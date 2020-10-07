import {
  InputFieldComponent as CheckFieldInputComponent,
  TableCellComponent as CheckFieldTableCellComponent,
} from "./CheckField";
import { createRemoteLabelValueCollectionField } from "./BaseRemoteLabelValueCollectionField";

const RemoteCheckField = createRemoteLabelValueCollectionField(CheckFieldInputComponent, CheckFieldTableCellComponent);

export default RemoteCheckField;
