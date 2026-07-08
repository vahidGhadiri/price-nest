import { describe, expect, it } from 'vitest';

import QueryBuilder from './';

describe('QueryBuilder (AAA + URL construction)', () => {
    const builder = new QueryBuilder();

    it('should throw error when serviceEndpoint is empty', () => {
        // Arrange
        const input = { baseUrl: 'https://api.com', serviceEndpoint: '' };

        // Act + Assert
        expect(() => builder.build(input)).toThrow('Service endpoint cannot be empty');
    });

    it('should throw error when baseUrl is empty', () => {
        // Arrange
        const input = { serviceEndpoint: '/users', baseUrl: '' };

        // Act + Assert
        expect(() => builder.build(input)).toThrow('Base URL cannot be empty');
    });

    it('should build basic URL without query or params', () => {
        // Arrange
        const input = { baseUrl: 'https://api.com/', serviceEndpoint: '/users' };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/users');
    });

    it('should replace path params correctly', () => {
        // Arrange
        const input = { serviceEndpoint: '/users/:id', baseUrl: 'https://api.com', pathParams: { id: 123 } };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/users/123');
    });

    it('should encode path params safely', () => {
        // Arrange
        const input = { pathParams: { name: 'john doe' }, serviceEndpoint: '/users/:name', baseUrl: 'https://api.com' };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/users/john%20doe');
    });

    it('should throw error when path param key is empty', () => {
        // Arrange
        const input = { serviceEndpoint: '/users/:id', baseUrl: 'https://api.com', pathParams: { '': 1 } };

        // Act + Assert
        expect(() => builder.build(input)).toThrow('Path parameter key cannot be empty');
    });

    it('should build query string from object', () => {
        // Arrange
        const input = { query: { limit: 10, page: 1 }, baseUrl: 'https://api.com', serviceEndpoint: '/users' };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/users?limit=10&page=1');
    });

    it('should handle array query params', () => {
        // Arrange
        const input = { baseUrl: 'https://api.com', serviceEndpoint: '/users', query: { id: [1, 2, 3] } };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/users?id=1&id=2&id=3');
    });

    it('should ignore null query values', () => {
        // Arrange
        const input = { query: { name: null, age: 20 }, baseUrl: 'https://api.com', serviceEndpoint: '/users' };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/users?age=20');
    });

    it('should append string query as path segment', () => {
        // Arrange
        const input = { serviceEndpoint: '/search', baseUrl: 'https://api.com', query: 'john' };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/search/john');
    });

    it('should ignore empty string query', () => {
        // Arrange
        const input = { serviceEndpoint: '/search', baseUrl: 'https://api.com', query: '' };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/search');
    });

    it('should build full URL with path params + query', () => {
        // Arrange
        const input = { serviceEndpoint: '/users/:id', baseUrl: 'https://api.com/', pathParams: { id: 42 }, query: { sort: 'asc' } };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/users/42?sort=asc');
    });

    it('should normalize extra slashes in baseUrl and endpoint', () => {
        // Arrange
        const input = { serviceEndpoint: '//users//', baseUrl: 'https://api.com//' };

        // Act
        const result = builder.build(input);

        // Assert
        expect(result).toBe('https://api.com/users');
    });
});
