import { beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBuilder, { ErrorStatusCode, ErrorMessages } from '.';

describe('ErrorBuilder (AAA + fully mocked behavior)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return errors when errors object is provided', () => {
        // Arrange
        const input = { errors: { field: 'error' }, message: 'ignored' };

        // Act
        const result = ErrorBuilder.createErrorResponse(input);

        // Assert
        expect(result).toEqual({ field: 'error' });
    });

    it('should return message when no errors exist', () => {
        // Arrange
        const input = { message: 'something failed' };

        // Act
        const result = ErrorBuilder.createErrorResponse(input);

        // Assert
        expect(result).toEqual({ message: 'something failed' });
    });

    it('should return empty object when nothing provided', () => {
        // Arrange
        const input = {};

        // Act
        const result = ErrorBuilder.createErrorResponse(input);

        // Assert
        expect(result).toEqual({});
    });

    it('should return parsed payload errors when available', () => {
        // Arrange
        const payload = { errors: { email: 'invalid email' } };

        // Act
        const result = ErrorBuilder.createFromHttpPayload(400, payload);

        // Assert
        expect(result).toEqual({ email: 'invalid email' });
    });

    it('should fallback to status mapping when payload is empty', () => {
        // Arrange
        const status = ErrorStatusCode.Unauthorized;

        // Act
        const result = ErrorBuilder.createFromHttpPayload(status, {});

        // Assert
        expect(result).toEqual({ message: ErrorMessages.Unauthorized });
    });

    it('should fallback to general service when status is unknown', () => {
        // Arrange
        const status = 999;

        // Act
        const result = ErrorBuilder.createFromHttpPayload(status, {});

        // Assert
        expect(result).toEqual({ message: ErrorMessages.GeneralService });
    });

    it('should return timeout error for AbortError', () => {
        // Arrange
        const error = new DOMException('aborted', 'AbortError');

        // Act
        const result = ErrorBuilder.createFromClientError(error);

        // Assert
        expect(result).toEqual(expect.objectContaining({ message: ErrorMessages.RequestTimeout }));
    });

    it('should return connection error for fetch failure', () => {
        // Arrange
        const error = new TypeError('Failed to fetch');

        // Act
        const result = ErrorBuilder.createFromClientError(error);

        // Assert
        expect(result).toEqual({ message: ErrorMessages.ConnectionProblem });
    });

    it('should normalize raw error object', () => {
        // Arrange
        const error = { field: 'invalid' };

        // Act
        const result = ErrorBuilder.createFromClientError(error);

        // Assert
        expect(result).toEqual({ field: 'invalid' });
    });

    it('should parse response JSON and delegate to payload handler', async () => {
        // Arrange
        const json = vi.fn().mockResolvedValue({ errors: { username: 'taken' } });

        const clone = vi.fn().mockReturnValue({ json });

        const response: any = { status: 400, clone };

        // Act
        const result = await ErrorBuilder.createFromHttpResponse(response);

        // Assert
        expect(clone).toHaveBeenCalledTimes(1);
        expect(json).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ username: 'taken' });
    });

    it('should fallback when response json fails', async () => {
        // Arrange
        const json = vi.fn().mockRejectedValue(new Error('invalid json'));
        const clone = vi.fn().mockReturnValue({ json });

        const response: any = { status: ErrorStatusCode.GeneralService, clone };

        // Act
        const result = await ErrorBuilder.createFromHttpResponse(response);

        // Assert
        expect(result).toEqual({ message: ErrorMessages.GeneralService });
    });
});
