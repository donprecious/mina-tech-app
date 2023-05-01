export class BaseResponse {
  static Success<Type>(data: Type, message = ''): Ok<Type> {
    return {
      data,
      success: true,
      message,
    } as Ok<Type>;
  }

  static Failue<Type>(errors: unknown, message = '', errorCode: string | number = null, data: Type = null): Ok<Type> {
    return {
      data,
      success: false,
      message,
      errorCode,
      errors: errors,
    } as Fail<Type>;
  }
}

class BaseResponseType {
  success = false;
  message = '';
}

class Ok<Type> extends BaseResponseType {
  data?: Type;
}

class Fail<Type> extends BaseResponseType {
  errors?: unknown;
  errorCode?: string;
}
