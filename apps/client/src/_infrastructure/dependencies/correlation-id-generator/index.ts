import { v4 as uuidv4 } from 'uuid';

class CorrelationIdGenerator {
    private static instance: CorrelationIdGenerator;

    private constructor() {}

    public static getInstance(): CorrelationIdGenerator {
        if (!CorrelationIdGenerator.instance) {
            CorrelationIdGenerator.instance = new CorrelationIdGenerator();
            return CorrelationIdGenerator.instance;
        }
        return CorrelationIdGenerator.instance;
    }

    public generate(): string {
        return uuidv4();
    }
}

const correlationIdGenerator = CorrelationIdGenerator.getInstance();

export default correlationIdGenerator;
