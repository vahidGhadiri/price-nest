import { Guard } from '@/_infrastructure/gaurds';

export type BuiltResponse<T> = Result<T>;

export default class ResponseBuilder {
    build<T>(payload: unknown): BuiltResponse<T> {
        Guard.against(payload, 'payload').undefined().null();

        if (this.isErrorPayload(payload)) {
            return {
                error: payload as ErrorType,
                success: false,
                data: null,
            };
        }

        return {
            data: payload as T,
            success: true,
            error: null,
        };
    }

    private isErrorPayload(payload: unknown): payload is ErrorType {
        if (typeof payload !== 'object' || payload === null) return false;

        const result = payload as Record<string, unknown>;

        return typeof result.message === 'string' && typeof result.code === 'string' && typeof result.severity === 'string';
    }
}
