import { beforeEach, describe, expect, it } from 'vitest';

import HeadersBuilder from './';

describe('HeadersBuilder (AAA + fluent API)', () => {
    let builder: HeadersBuilder;

    beforeEach(() => {
        builder = new HeadersBuilder();
    });

    it('should add valid header', () => {
        // Arrange
        // Act
        builder.add('Authorization', 'token');

        // Assert
        expect(builder.get('Authorization')).toBe('token');
    });

    it('should ignore null or undefined values', () => {
        // Arrange
        // Act
        builder.add('X-Test', null);

        // Assert
        expect(builder.has('X-Test')).toBe(false);
    });

    it('should throw error for empty key', () => {
        // Arrange
        // Act + Assert
        expect(() => builder.add('', 'value')).toThrow('Header key cannot be empty');
    });

    it('should throw error for invalid key format', () => {
        // Arrange
        // Act + Assert
        expect(() => builder.add('Invalid Key!', 'value')).toThrow('Invalid header key: Invalid Key!');
    });

    it('should add header only when condition is true', () => {
        // Arrange
        const condition = true;

        // Act
        builder.addIf(condition, 'X-Flag', 'true');

        // Assert
        expect(builder.get('X-Flag')).toBe('true');
    });

    it('should not add header when condition is false', () => {
        // Arrange
        const condition = false;

        // Act
        builder.addIf(condition, 'X-Flag', 'true');

        // Assert
        expect(builder.has('X-Flag')).toBe(false);
    });

    it('should remove header', () => {
        // Arrange
        builder.add('X-Remove', 'yes');

        // Act
        builder.remove('X-Remove');

        // Assert
        expect(builder.has('X-Remove')).toBe(false);
    });

    it('should override existing header value', () => {
        // Arrange
        builder.add('X-Value', '1');

        // Act
        builder.override('X-Value', '2');

        // Assert
        expect(builder.get('X-Value')).toBe('2');
    });

    it('should return immutable snapshot of headers', () => {
        // Arrange
        builder.add('A', '1');

        // Act
        const result = builder.build();
        result['A'] = 'modified';

        // Assert
        expect(builder.get('A')).toBe('1');
    });

    it('should clear all headers', () => {
        // Arrange
        builder.add('A', '1');
        builder.add('B', '2');

        // Act
        builder.reset();

        // Assert
        expect(builder.build()).toEqual({});
    });

    it('should check existence of header', () => {
        // Arrange
        builder.add('X', '1');

        // Act
        const result = builder.has('X');

        // Assert
        expect(result).toBe(true);
    });

    it('should merge valid headers', () => {
        // Arrange
        const input = { A: '1', B: '2' };

        // Act
        builder.merge(input);

        // Assert
        expect(builder.build()).toEqual({ A: '1', B: '2' });
    });

    it('should ignore invalid merge entries', () => {
        // Arrange
        const input = { 'Invalid Key!': 'x', A: '1' };

        // Act
        builder.merge(input);

        // Assert
        expect(builder.build()).toEqual({ A: '1' });
    });

    it('should safely handle undefined merge input', () => {
        // Arrange
        // Act
        builder.merge(undefined);

        // Assert
        expect(builder.build()).toEqual({});
    });

    it('should convert to native Headers object', () => {
        // Arrange
        builder.add('A', '1');

        // Act
        const headers = builder.toHeaders();

        // Assert
        expect(headers.get('A')).toBe('1');
    });

    it('should support method chaining', () => {
        // Arrange + Act
        builder.add('A', '1').addIf(true, 'B', '2').override('A', '3').remove('B');

        // Assert
        expect(builder.build()).toEqual({ A: '3' });
    });
});
