type ClearStorage = {
    isPersisted: boolean;
};

export interface SetStorageData<Value> {
    isPersisted: boolean;
    value: Value;
    key?: string;
}

export interface RemoveStorageItem {
    isPersisted: boolean;
    key: string;
}

export interface GetStorageData {
    isPersisted: boolean;
    key?: string;
}

export interface IStorage {
    setStorageData: <Value>(data: SetStorageData<Value>[] | SetStorageData<Value>) => void;
    getStorageData: <Value>({ isPersisted, key }: GetStorageData) => Value | null;
    removeItem: ({ isPersisted, key }: RemoveStorageItem) => void;
    clear: (payload: ClearStorage | boolean) => void;
}
