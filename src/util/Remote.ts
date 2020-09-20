import axios from "axios";
import { throwRemoteResponseError } from "./Error";

export const loadRemoteData = async (
  resourceUrl: string,
  propertyPathName: string,
  propertyPathValue: string,
  shouldBeAnArray = true,
): Promise<any> => {
  const response = await axios.get(resourceUrl);
  let responseData = response.data;
  if (propertyPathValue) {
    responseData = propertyPathValue.split(".").reduce((parent, propertyName) => parent[propertyName], responseData);
  }
  if ((shouldBeAnArray && Array.isArray(responseData)) || !shouldBeAnArray) {
    return responseData;
  } else {
    throwRemoteResponseError(propertyPathName, propertyPathValue, responseData);
  }
};
