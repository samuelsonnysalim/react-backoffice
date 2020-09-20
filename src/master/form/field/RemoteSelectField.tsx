import React, { useState, useEffect, useCallback } from "react";
import { createField } from "./BaseField";
import {
  InputFieldComponent as SelectFieldInputComponent,
  TableCellComponent as SelectFieldTableCellComponent,
} from "./SelectField";
import { loadRemoteData } from "../../../util/Remote";

interface Props {
  optionsResourceUrl: string;
  optionsPropertyPath: string;
  optionValuePropertyName: string;
  optionLabelPropertyName: string;
}

const RemoteSelectField = createField<string, Partial<Props>>(
  ({
    optionsResourceUrl,
    optionsPropertyPath,
    optionValuePropertyName,
    optionLabelPropertyName,
    ...props
  }): JSX.Element => {
    const [options, setOptions] = useState<{ value: string; label: string }[]>();

    const loadData = useCallback(async () => {
      if (!props.isLoading && optionsResourceUrl) {
        props.setLoading(true);
        const responseData = (await loadRemoteData(
          optionsResourceUrl,
          "optionsPropertyPath",
          optionsPropertyPath,
        )) as any[];
        setOptions(
          responseData.map(data => ({
            value: data[optionValuePropertyName || "value"],
            label: data[optionLabelPropertyName || "label"],
          })),
        );
        props.setLoading(false);
      }
    }, [props.isLoading, optionsResourceUrl, optionsPropertyPath, optionValuePropertyName, optionLabelPropertyName]);

    useEffect(() => {
      loadData();
    }, [optionsResourceUrl, optionsPropertyPath, optionValuePropertyName, optionLabelPropertyName]);

    return <SelectFieldInputComponent {...props} options={options} />;
  },
  SelectFieldTableCellComponent,
);

export default RemoteSelectField;
