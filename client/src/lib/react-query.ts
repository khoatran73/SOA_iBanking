import { AxiosError } from 'axios';
import { DefaultOptions, QueryClient, UseMutationOptions, UseQueryOptions } from 'react-query';
// import {PromiseValue} from 'type-fest';

export type PromiseValue<PromiseType> = PromiseType extends PromiseLike<infer Value>
    ? PromiseValue<Value>
    : PromiseType;

const queryConfig: DefaultOptions = {
    queries: {
        useErrorBoundary: true,
        refetchOnWindowFocus: false,
        retry: false,
    },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type QueryConfig<FetcherFnType extends (...args: any) => any> = UseQueryOptions<
    PromiseValue<ReturnType<FetcherFnType>>
>;

export type MutationConfig<FetcherFnType extends (...args: any) => any> = UseMutationOptions<
    PromiseValue<ReturnType<FetcherFnType>>,
    AxiosError,
    Parameters<FetcherFnType>[0]
>;
