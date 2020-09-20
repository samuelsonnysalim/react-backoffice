import { useState, useEffect, useCallback } from "react";
import { SortedFields } from "../../DataTable";
import { MasterFactory } from "../../../master/Master";

export interface Sorting {
  sortingDataResourceUrl: string;
  sortedFields: SortedFields;
  setSortedFields: (sortedFields: SortedFields) => void;
  setDataResourceUrl: (dataResourceUrl: string) => void;
  setMasterFactory: (masterFactory: MasterFactory) => void;
}

interface UseSortingConfig {
  currentSortedFields: SortedFields;
  sortQueryString: string;
  orderQueryString: string;
}

const defaultCurrentSort = {};
const defaultSortQueryString = "sort";

const composeSortedFieldsForRest = (masterFactory: MasterFactory, sortedFields: SortedFields): SortedFields => {
  const sortedFieldsForRest: SortedFields = {};
  Object.keys(sortedFields).forEach(field => {
    const childProps = masterFactory.childrenProps?.find(({ propertyName }) => propertyName === field);
    if (typeof childProps.restPropertyName === "string") {
      sortedFieldsForRest[childProps.restPropertyName] = sortedFields[field];
    } else if (typeof childProps.restPropertyName === "object") {
      Object.keys(childProps.restPropertyName).forEach(
        key => (sortedFieldsForRest[childProps.restPropertyName[key]] = sortedFields[field]),
      );
    } else {
      sortedFieldsForRest[childProps.propertyName] = sortedFields[field];
    }
  });
  return sortedFieldsForRest;
};

export const useSorting = (config: Partial<UseSortingConfig> = {}): Sorting => {
  const [sortedFields, setSortedFields] = useState<SortedFields>(config.currentSortedFields || defaultCurrentSort);
  const [masterFactory, setMasterFactory] = useState<MasterFactory>();
  const [dataResourceUrl, setDataResourceUrl] = useState<string>();
  const [queryString, setQueryString] = useState<string>();
  const sortQueryString = config.sortQueryString || defaultSortQueryString;
  const orderQueryString = config.orderQueryString || sortQueryString;

  const safeSetMasterFactory = useCallback(
    (currentMasterFactory: MasterFactory) => {
      if (JSON.stringify(currentMasterFactory) !== JSON.stringify(masterFactory)) {
        setMasterFactory(currentMasterFactory);
      }
    },
    [masterFactory],
  );

  useEffect(() => {
    setSortedFields(config.currentSortedFields);
  }, [config.currentSortedFields]);

  useEffect(() => {
    if (masterFactory && sortedFields) {
      let queryString = "";
      const sortedFieldsForRest = composeSortedFieldsForRest(masterFactory, sortedFields);
      if (sortQueryString === orderQueryString) {
        Object.keys(sortedFieldsForRest).forEach(field => {
          queryString += `${queryString !== "" ? "&" : ""}${sortQueryString}=${field},${sortedFieldsForRest[field]}`;
        });
      } else {
        if (Object.keys(sortedFieldsForRest).length > 0) {
          queryString = `${sortQueryString}=${Object.keys(sortedFieldsForRest)
            .map(field => field)
            .join(",")}&${orderQueryString}=${Object.keys(sortedFieldsForRest)
            .map(field => sortedFieldsForRest[field])
            .join(",")}`;
        }
      }
      setQueryString(queryString);
    }
  }, [masterFactory, sortedFields]);

  return {
    sortingDataResourceUrl: dataResourceUrl
      ? `${dataResourceUrl}${queryString ? `${dataResourceUrl.includes("?") ? "&" : "?"}${queryString}` : ""}`
      : null,
    sortedFields,
    setSortedFields,
    setMasterFactory: safeSetMasterFactory,
    setDataResourceUrl,
  };
};
