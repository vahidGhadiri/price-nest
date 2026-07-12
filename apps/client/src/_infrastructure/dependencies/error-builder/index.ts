import { Guard } from '@infrastructure/gaurds';

export enum ErrorCode {
    ConnectionProblem = 'ConnectionProblem',
    RequestTimeout = 'RequestTimeout',
    GeneralService = 'GeneralService',
    Unauthorized = 'Unauthorized',
}

export enum ErrorSeverity {
    Business = 'Business',
    System = 'System',
}

interface CreateErrorParams {
    fieldErrors?: Record<string, string>;
    severity: ErrorSeverity;
    message?: string;
    code: ErrorCode;
}

export const MAXIMUM_REQUEST_LATENCY = 30_000;

export const ErrorMessages: Record<ErrorCode, string> = {
    [ErrorCode.RequestTimeout]: 'هیچ پاسخی در زمان مجاز از سرور دریافت نشد',
    [ErrorCode.ConnectionProblem]: 'مشکلی در برقراری ارتباط وجود دارد',
    [ErrorCode.GeneralService]: 'متاسفانه خطایی رخ داده است',
    [ErrorCode.Unauthorized]: 'دسترسی شما منقضی شده است',
};

export class ErrorBuilder {
    public static readonly ErrorResponses = {
        ConnectionProblem: (fieldErrors?: Record<string, string>): ErrorType =>
            ErrorBuilder.createErrorResponse({
                code: ErrorCode.ConnectionProblem,
                severity: ErrorSeverity.System,
                fieldErrors,
            }),

        RequestTimeout: (fieldErrors?: Record<string, string>): ErrorType =>
            ErrorBuilder.createErrorResponse({
                code: ErrorCode.RequestTimeout,
                severity: ErrorSeverity.System,
                fieldErrors,
            }),

        GeneralService: (fieldErrors?: Record<string, string>): ErrorType =>
            ErrorBuilder.createErrorResponse({
                code: ErrorCode.GeneralService,
                severity: ErrorSeverity.System,
                fieldErrors,
            }),

        Unauthorized: (fieldErrors?: Record<string, string>): ErrorType =>
            ErrorBuilder.createErrorResponse({
                severity: ErrorSeverity.Business,
                code: ErrorCode.Unauthorized,
                fieldErrors,
            }),

        Custom: (error: ErrorType): ErrorType => error,
    };

    public static fromClientError(error: unknown): ErrorType {
        Guard.against(error, 'error').undefined().null();

        if (error instanceof DOMException && error.name === 'AbortError') {
            return this.ErrorResponses.RequestTimeout();
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
            return this.ErrorResponses.ConnectionProblem();
        }

        return this.ErrorResponses.GeneralService();
    }

    public static createErrorResponse({ fieldErrors, severity, message, code }: CreateErrorParams): ErrorType {
        return {
            message: message ?? ErrorMessages[code],
            severity,
            code,
            ...(fieldErrors && { fieldErrors }),
        };
    }
}

export default ErrorBuilder;
