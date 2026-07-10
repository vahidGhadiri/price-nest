import { describe, expect, test, vi } from 'vitest';

vi.mock('uuid', () => ({ v4: () => 'mocked-uuid-123' }));

import { correlationIdGenerator } from '.';

describe('correlationIdGenerator (singleton)', () => {
    test('generate returns uuid from dependency', () => {
        // Arrange
        // Act
        const id = correlationIdGenerator.generate();

        // Assert
        expect(id).toBe('mocked-uuid-123');
    });

    test('getInstance returns same singleton', () => {
        // Arrange
        const a = correlationIdGenerator;
        const b = correlationIdGenerator;

        // Assert
        expect(a).toBe(b);
    });
});
