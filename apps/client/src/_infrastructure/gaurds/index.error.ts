export class GuardClauseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GuardClauseError';
    }
}
