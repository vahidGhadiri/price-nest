import { GuardClauseError } from './index.error';

export class GuardChain<T> {
    constructor(
        private readonly value: T,
        private readonly name: string
    ) {}

    greaterThan(value: number): this {
        if (typeof this.value === 'number' && this.value > value) {
            throw new GuardClauseError(`${this.name} cannot be greater than ${value}`);
        }
        return this;
    }

    lessThan(value: number): this {
        if (typeof this.value === 'number' && this.value < value) {
            throw new GuardClauseError(`${this.name} cannot be less than ${value}`);
        }

        return this;
    }

    empty(): this {
        if (typeof this.value === 'string' && this.value.length === 0) {
            throw new GuardClauseError(`${this.name} cannot be empty`);
        }

        return this;
    }

    negative(): this {
        if (typeof this.value === 'number' && this.value < 0) {
            throw new GuardClauseError(`${this.name} cannot be negative`);
        }

        return this;
    }

    zero(): this {
        if (typeof this.value === 'number' && this.value === 0) {
            throw new GuardClauseError(`${this.name} cannot be zero`);
        }

        return this;
    }

    undefined(): this {
        if (this.value === undefined) {
            throw new GuardClauseError(`${this.name} cannot be undefined`);
        }

        return this;
    }

    null(): this {
        if (this.value === null) {
            throw new GuardClauseError(`${this.name} cannot be null`);
        }
        return this;
    }
}
