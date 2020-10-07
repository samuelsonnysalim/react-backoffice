import React, { ComponentType, useEffect, useState } from "react";
import { useLoadData } from "../../../util/Remote";
import { createField, Field } from "./BaseField";

export interface Props {
  optionsResourceUrl: string;
  optionsPropertyPath: string;
  optionValuePropertyName: string;
  optionLabelPropertyName: string;
}

interface ComponentProps {
  options?: { label: string; value: string }[];
}

export const createRemoteLabelValueCollectionField = (
  InputFieldComponent: ComponentType<ComponentProps>,
  TableCellComponent: ComponentType<ComponentProps>,
): Field<string, Partial<Props>> =>
  createField<string, Partial<Props>>(
    ({
      optionsResourceUrl,
      optionsPropertyPath,
      optionValuePropertyName,
      optionLabelPropertyName,
      ...props
    }): JSX.Element => {
      const [options, setOptions] = useState<{ value: string; label: string }[]>();
      const loadDataFactory = useLoadData(props, optionsResourceUrl, "optionsPropertyPath", optionsPropertyPath);

      useEffect(() => {
        loadDataFactory.loadData().then(data =>
          setOptions(
            data?.map(datum => ({
              value: datum[optionValuePropertyName || "value"],
              label: datum[optionLabelPropertyName || "label"],
            })),
          ),
        );
      }, [optionsResourceUrl, optionsPropertyPath, optionValuePropertyName, optionLabelPropertyName]);

      return <InputFieldComponent {...props} options={options} />;
    },
    ({
      optionsResourceUrl,
      optionsPropertyPath,
      optionValuePropertyName,
      optionLabelPropertyName,
      ...props
    }): JSX.Element => {
      const [options, setOptions] = useState<{ value: string; label: string }[]>();
      const loadDataFactory = useLoadData(null, optionsResourceUrl, "optionsPropertyPath", optionsPropertyPath);

      useEffect(() => {
        loadDataFactory.loadData().then(data =>
          setOptions(
            data?.map(datum => ({
              value: datum[optionValuePropertyName || "value"],
              label: datum[optionLabelPropertyName || "label"],
            })),
          ),
        );
      }, [optionsResourceUrl, optionsPropertyPath, optionValuePropertyName, optionLabelPropertyName]);

      return <TableCellComponent {...props} options={options} />;
    },
  );
