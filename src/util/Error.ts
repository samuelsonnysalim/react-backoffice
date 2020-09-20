export const throwRemoteResponseError = (
  propertyPathName: string,
  propertyPathValue: string,
  foundResponseData: any,
  shouldBeAnArray = true,
): void => {
  throw new Error(
    `Response data must be an ${
      shouldBeAnArray ? "array" : "object"
    } or use "${propertyPathName}" property to define property path. Found: "${typeof foundResponseData}", data property path: "${propertyPathValue}".`,
  );
};
