import axios from "axios";
import { useCallback } from "react";
import { throwRemoteResponseError } from "./Error";

const remoteDataCache = {};

interface LoadData {
  loadData: () => Promise<any[] | undefined | null>;
}

export const loadRemoteData = async (
  resourceUrl: string,
  propertyPathName: string,
  propertyPathValue: string,
  shouldBeAnArray = true,
  cached = false,
): Promise<any> => {
  if (cached && remoteDataCache[resourceUrl]) {
    return remoteDataCache[resourceUrl];
  }

  const response = await axios.get(resourceUrl);
  let responseData = response.data;
  if (propertyPathValue) {
    responseData = propertyPathValue.split(".").reduce((parent, propertyName) => parent[propertyName], responseData);
  }
  if ((shouldBeAnArray && Array.isArray(responseData)) || !shouldBeAnArray) {
    if (cached) {
      remoteDataCache[resourceUrl] = responseData;
    }
    return responseData;
  } else {
    throwRemoteResponseError(propertyPathName, propertyPathValue, responseData);
  }
};

export const useLoadData = (
  props: { isLoading?: boolean; setLoading?: (loading: boolean) => void } | undefined | null,
  resourceUrl: string,
  propertyPathName: string,
  propertyPath: string,
): LoadData => {
  const loadData = useCallback(async (): Promise<any[]> => {
    if (!props?.isLoading && resourceUrl) {
      props?.setLoading && props.setLoading(true);
      const responseData = (await loadRemoteData(resourceUrl, propertyPathName, propertyPath, true, true)) as any[];
      props?.setLoading && props.setLoading(false);
      return responseData;
    }
    return null;
  }, [props?.isLoading, resourceUrl, propertyPath]);

  return { loadData };
};
