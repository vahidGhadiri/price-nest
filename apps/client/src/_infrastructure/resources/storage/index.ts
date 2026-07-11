import type { RemoveStorageItem, GetStorageData, SetStorageData, IStorage } from '@contracts';

import { Guard } from '@infrastructure/gaurds';

export default class Storage implements IStorage {
    setStorageData<Value>(data: SetStorageData<Value>[] | SetStorageData<Value>): void {
        const dataArray = Array.isArray(data) ? data : [data];
        for (const { isPersisted, value, key } of dataArray) {
            Guard.against(key, 'Storage key').undefined().null().empty();
            const storage = isPersisted ? localStorage : sessionStorage;
            const storageData = JSON.stringify(value);
            storage.setItem(key!, storageData);
        }
    }

    getStorageData<Value>({ isPersisted, key }: GetStorageData): Value | null {
        Guard.against(key, 'Storage key').undefined().null().empty();
        const storage = isPersisted ? localStorage : sessionStorage;
        try {
            const storageData = storage.getItem(key!);
            return storageData ? (JSON.parse(storageData) as Value) : null;
        } catch {
            return null;
        }
    }

    clear(
        payload:
            | {
                  isPersisted: boolean;
              }
            | boolean
    ): void {
        const isPersisted = typeof payload === 'boolean' ? payload : payload.isPersisted;
        const storage = isPersisted ? localStorage : sessionStorage;
        storage.clear();
    }

    removeItem({ isPersisted, key }: RemoveStorageItem): void {
        const storage = isPersisted ? localStorage : sessionStorage;
        storage.removeItem(key);
    }
}

const storage = new Storage();

export { storage };
