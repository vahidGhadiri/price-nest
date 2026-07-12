export type Primitive = undefined | boolean | string | number | bigint | symbol | object | null;

export type NumberGuard<T> = T extends number ? NumberGuardMethods : unknown;

export type StringGuard<T> = T extends string ? StringGuardMethods : unknown;

export interface NumberGuardMethods {
    greaterThan(value: number): this;
    lessThan(value: number): this;
    negative(): this;
    zero(): this;
}

export interface StringGuardMethods {
    empty(): this;
}
