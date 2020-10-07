import {
  InputFieldComponent as RadioFieldInputComponent,
  TableCellComponent as RadioFieldTableCellComponent,
} from "./RadioField";
import { createRemoteLabelValueCollectionField } from "./BaseRemoteLabelValueCollectionField";

const RemoteRadioField = createRemoteLabelValueCollectionField(RadioFieldInputComponent, RadioFieldTableCellComponent);

export default RemoteRadioField;
