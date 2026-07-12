declare global {
    type QueryValueType = (boolean | string | number)[] | undefined | boolean | string | number | null;

    type QueryParams = Record<string, QueryValueType> | string;
    type PathParams = Record<string, string | number>;

    export type ErrorType = {
        fieldErrors?: Record<string, string>;
        severity: ErrorSeverity;
        code: ErrorCode;
        message: string;
    };

    type Result<T> =
        | {
              error: ErrorType;
              success: false;
              data: null;
          }
        | {
              success: true;
              error: null;
              data: T;
          };
}

export {};
