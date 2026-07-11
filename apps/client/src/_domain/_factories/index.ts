export interface CreateDomainFactoryParams<Dependencies, Repository, UseCase> {
    createRepository: (dependencies: Dependencies) => Repository;
    createUseCase: (repository: Repository) => UseCase;
    createDependencies: () => Dependencies;
}

const createDomainFactory = <Dependencies, Repository, UseCase>({
    createDependencies,
    createRepository,
    createUseCase,
}: CreateDomainFactoryParams<Dependencies, Repository, UseCase>) => {
    return (): UseCase => {
        const dependencies = createDependencies();
        const repository = createRepository(dependencies);
        return createUseCase(repository);
    };
};

export default createDomainFactory;
