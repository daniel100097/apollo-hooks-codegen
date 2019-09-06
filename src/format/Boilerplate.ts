export const disclaimer = `
/*
 * This file was generated by graphql-code-generator with the apollo-hooks-codegen plugin.
 * Any changes made to the file will be overwritten.
 */
`

export const imports = `
import {
    ApolloConsumer,
    CommonOptions,
    getApolloContext,
    LazyQueryHookOptions,
    MutationHookOptions,
    MutationOptions,
    MutationTuple,
    QueryCurrentObservable,
    QueryHookOptions,
    QueryLazyOptions,
    QueryOptions,
    QueryPreviousData,
    QueryTuple,
    RenderPromises,
    resetApolloContext,
    SubscriptionCurrentObservable,
    SubscriptionHookOptions,
    SubscriptionOptions,
    useApolloClient,
    useLazyQuery,
    useMutation,
    useQuery,
    useSubscription,
} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { DocumentNode, GraphQLError } from 'graphql';
import { MutationResult, MutationFunctionOptions } from '@apollo/react-common'
`

export const boilerplate = `
/*
 * Boilerplate
 */

type MutationHookFn<TData, TVariables> = [(options?: MutationFunctionOptions<TData, TVariables>) => Promise<ExecutionResult<TData>>, MutationResult<TData>];

export interface ExecutionResult<T = Record<string, any>> {
    data: T;
    extensions?: Record<string, any>;
    errors?: GraphQLError[];
}

type Nullable<T> = T | null;
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

const queryDefaultOptions = {
    fetchPolicy: 'cache-and-network' as 'cache-and-network',
};
const lazyQueryDefaultOptions = {};
const mutationDefaultOptions = {};
const subscriptionDefaultOptions = {};

`
