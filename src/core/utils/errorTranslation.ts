import { TFunction } from "i18next";

/**
 * Translates server error codes to user-friendly messages
 */
export const translateServerError = (
  t: TFunction,
  errorCode: string,
): string => {
  const translationKey = `serverErrors.${errorCode}`;
  const translation = t(translationKey);

  if (translation !== translationKey) {
    return translation;
  }

  return t("common.unexpectedError");
};

/**
 * Extracts error code from server response
 */
export const extractErrorCode = (error: any): string => {
  if (error?.response?.data?.code) {
    return error.response.data.code;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.code) {
    return error.code;
  }

  if (error?.message) {
    return error.message;
  }

  return "SERVER.INTERNAL_ERROR";
};

/**
 * Translates validation errors from server
 */
export const translateValidationErrors = (
  t: TFunction,
  errors: any[],
): string[] => {
  if (!Array.isArray(errors)) {
    return [];
  }

  return errors.map((error) => {
    if (typeof error === "string") {
      return translateServerError(t, error);
    }

    if (error?.code) {
      return translateServerError(t, error.code);
    }

    if (error?.message) {
      return translateServerError(t, error.message);
    }

    return t("common.unexpectedError");
  });
};
