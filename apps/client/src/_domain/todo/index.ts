import type { IHttp } from '@contracts';

import { http } from '@infrastructure';

import type { DomainServices } from './domain-services';
import { domainServices } from './domain-services';
import createDomainFactory from '../_factories';
import type { ITodoUsecase } from './use-case';
import TodoRepository from './repository';
import TodoUsecase from './use-case';

interface TodoDependencies {
    http: IHttp<DomainServices>;
}

export const todoDomainProvider = createDomainFactory<TodoDependencies, TodoRepository, ITodoUsecase>({
    createDependencies: () => ({ http: http(domainServices) }),
    createUseCase: (repository) => new TodoUsecase(repository),
    createRepository: ({ http }) => new TodoRepository(http),
});

export default todoDomainProvider;
