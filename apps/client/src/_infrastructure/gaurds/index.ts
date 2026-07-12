import { GuardChain } from './index.chains';

type GuardAPI<T> = (T extends number
    ? {
          greaterThan(value: number): GuardChain<T>;
          lessThan(value: number): GuardChain<T>;
          negative(): GuardChain<T>;
          zero(): GuardChain<T>;
      }
    : object) &
    (T extends string
        ? {
              empty(): GuardChain<T>;
          }
        : object) &
    GuardChain<T>;

export class Guard {
    private constructor() {}

    static against<T>(value: T, name: string): GuardAPI<T> {
        return new GuardChain(value, name) as GuardAPI<T>;
    }
}
