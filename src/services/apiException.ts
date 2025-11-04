import { ApiError, ErrorItem } from "@/types";

export class ApiException extends Error {
  type: string;
  code?: string;
  message: string;
  errors?: ErrorItem[];

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.type = apiError.type;
    this.code = apiError.code;
    this.message = apiError.message;
    this.errors = apiError.errors;
  }
}
