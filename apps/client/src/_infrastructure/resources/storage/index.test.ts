import { beforeEach, beforeAll, describe, afterAll, expect, it } from 'vitest';

import Storage from './';

type StorageMock = {
    setItem: (key: string, value: string) => void;
    getItem: (key: string) => string | null;
    key: (index: number) => string | null;
    removeItem: (key: string) => void;
    readonly length: number;
    clear: () => void;
};

const createStorageMock = (): StorageMock => {
    const storageMap = new Map<string, string>();

    return {
        getItem(key: string) {
            return storageMap.has(key) ? (storageMap.get(key) ?? null) : null;
        },
        key(index: number) {
            return Array.from(storageMap.keys())[index] ?? null;
        },
        setItem(key: string, value: string) {
            storageMap.set(key, value);
        },
        removeItem(key: string) {
            storageMap.delete(key);
        },
        get length() {
            return storageMap.size;
        },
        clear() {
            storageMap.clear();
        },
    };
};

describe('Storage', () => {
    let storage: Storage;
    const originalLocalStorage = globalThis.localStorage;
    const originalSessionStorage = globalThis.sessionStorage;

    beforeAll(() => {
        Object.defineProperty(globalThis, 'localStorage', { value: createStorageMock(), configurable: true, writable: true });
        Object.defineProperty(globalThis, 'sessionStorage', { value: createStorageMock(), configurable: true, writable: true });
    });

    afterAll(() => {
        Object.defineProperty(globalThis, 'localStorage', { value: originalLocalStorage, configurable: true, writable: true });
        Object.defineProperty(globalThis, 'sessionStorage', { value: originalSessionStorage, configurable: true, writable: true });
    });

    beforeEach(() => {
        storage = new Storage();

        localStorage.clear();
        sessionStorage.clear();
    });

    describe('getStorageData', () => {
        it('should throw error when key is missing', () => {
            // Arrange
            const fn = () => storage.getStorageData({ key: undefined as any, isPersisted: true });

            // Act + Assert
            expect(fn).toThrow('Storage key is required');
        });

        it('should return parsed value from localStorage', () => {
            // Arrange
            localStorage.setItem('test', JSON.stringify({ a: 1 }));

            // Act
            const result = storage.getStorageData({ isPersisted: true, key: 'test' });

            // Assert
            expect(result).toEqual({ a: 1 });
        });

        it('should return null when value does not exist', () => {
            // Act
            const result = storage.getStorageData({ isPersisted: true, key: 'missing' });

            // Assert
            expect(result).toBeNull();
        });

        it('should return null when JSON parsing fails', () => {
            // Arrange
            localStorage.setItem('bad', '{invalid-json');

            // Act
            const result = storage.getStorageData({ isPersisted: true, key: 'bad' });

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('setStorageData', () => {
        it('should store single value in localStorage', () => {
            // Arrange
            const data = { value: { name: 'ali' }, isPersisted: true, key: 'user' };

            // Act
            storage.setStorageData(data);

            // Assert
            expect(localStorage.getItem('user')).toBe(JSON.stringify({ name: 'ali' }));
        });

        it('should store multiple values', () => {
            // Arrange
            const data = [
                { isPersisted: true, key: 'a', value: 1 },
                { isPersisted: true, key: 'b', value: 2 },
            ];

            // Act
            storage.setStorageData(data);

            // Assert
            expect(localStorage.getItem('a')).toBe('1');
            expect(localStorage.getItem('b')).toBe('2');
        });

        it('should throw error when key is missing', () => {
            // Arrange
            const fn = () => storage.setStorageData({ key: undefined as any, isPersisted: true, value: 1 });

            // Act + Assert
            expect(fn).toThrow('Storage key is required');
        });
    });

    describe('removeItem', () => {
        it('should remove item from localStorage', () => {
            // Arrange
            localStorage.setItem('x', '123');

            // Act
            storage.removeItem({ isPersisted: true, key: 'x' });

            // Assert
            expect(localStorage.getItem('x')).toBeNull();
        });
    });

    describe('clear', () => {
        it('should clear localStorage', () => {
            // Arrange
            localStorage.setItem('a', '1');
            localStorage.setItem('b', '2');

            // Act
            storage.clear(true);

            // Assert
            expect(localStorage.getItem('a')).toBeNull();
            expect(localStorage.getItem('b')).toBeNull();
        });

        it('should clear localStorage with object payload', () => {
            // Arrange
            localStorage.setItem('a', '1');
            localStorage.setItem('b', '2');

            // Act
            storage.clear({ isPersisted: true });

            // Assert
            expect(localStorage.getItem('a')).toBeNull();
            expect(localStorage.getItem('b')).toBeNull();
        });

        it('should clear sessionStorage', () => {
            // Arrange
            sessionStorage.setItem('a', '1');

            // Act
            storage.clear(false);

            // Assert
            expect(sessionStorage.getItem('a')).toBeNull();
        });
    });
});
