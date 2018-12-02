/*
 * This file was generated by graphql-code-generator with the apollo-hooks-codegen plugin.
 * Any changes made to the file will be overwritten.
 */

import ApolloClient, {
  MutationOptions,
  ObservableQuery,
  WatchQueryOptions,
} from 'apollo-client'
import { createContext, useEffect, useState, useContext } from 'react'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

/*
 * Operations from ./tests/queries.graphql
 */

export const fetchVersion = defineQuery<
  {
    /* variables */
  },
  {
    /* data */
    myRequiredString: string
    myOptionalInt?: null | number
    myType?: null | {
      foo?: null | string
      nested: {
        bar?: null | number
      }
    }
    myIntList?: null | Array<null | number>
  }
>(gql`
  query fetchVersion {
    myRequiredString
    myOptionalInt

    myType {
      foo
      nested {
        bar
      }
    }

    myIntList
  }
`)

export const multiply = defineQuery<
  {
    /* variables */
    a: number
    b: number
    printResult?: null | boolean
  },
  {
    /* data */
    multiply?: null | number
  }
>(gql`
  query multiply($a: Int!, $b: Float!, $printResult: Boolean) {
    multiply(a: $a, b: $b, printResult: $printResult)
  }
`)

export const withList = defineQuery<
  {
    /* variables */
    list: Array<null | number>
  },
  {
    /* data */
    accumulate: string
  }
>(gql`
  query withList($list: [Int]!) {
    accumulate(list: $list)
  }
`)

export const mutateItBaby = defineMutation<
  {
    /* variables */
    input?: null | MyInputType
  },
  {
    /* data */
    doSomething?: null | {
      foo?: null | string
    }
  }
>(gql`
  mutation mutateItBaby($input: MyInputType) {
    doSomething(input: $input) {
      foo
    }
  }
`)

/*
 * GraphQL InputTypes
 */

interface MyInputType {
  anIntMaybe?: number
  aString: String
  aNestedObjectMaybe?: MyNestedInputType
  aNestedObject: MyNestedInputType
}

interface MyNestedInputType {
  itsRecursive?: MyNestedInputType
}

/*
 * Boilerplate
 */

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type Error = any

// We grab the ApolloClient from this context within our hooks
const apolloContext = createContext<{ apolloClient?: ApolloClient<any> }>({})

// Converts a gql-snippet into a user-callable function that takes options,
// which can then be passed to useApolloWatchQuery to execute the query.
function defineQuery<Variables, Data>(doc: DocumentNode) {
  return function configureQuery(
    options: Omit<WatchQueryOptions<Variables>, 'query'> = {}
  ) {
    return function executeQuery(apolloClient: ApolloClient<any>) {
      return apolloClient.watchQuery<Data>({ query: doc, ...options })
    }
  }
}

// Executes a query that has been created by calling the exported function with
// the same name as the query operation.
// The React Hooks rules apply - this function must be called unconditionally
// within a functional React Component and will rerender the component whenever
// the query result changes.
export function useApolloWatchQuery<Data, Variables>(
  configuredQuery: (
    apolloClient: ApolloClient<any>
  ) => ObservableQuery<Data, Variables>
): [Data | undefined, Error | undefined] {
  const { apolloClient } = useContext(apolloContext)
  const watchQuery = configuredQuery(apolloClient)

  const [data, setData] = useState<Data | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  useEffect(() => {
    const subscription = watchQuery.subscribe(
      result => setData(result.data),
      error => setError(error)
    )
    return () => subscription.unsubscribe()
  }, [])

  return [data, error]
}

// Converts a gql-snippet into a user-callable function that takes options,
// which can then be passed to useApolloMutation to provide the mutate function.
function defineMutation<Variables, Data>(mutation: DocumentNode) {
  return function configureMutation(
    options: Omit<MutationOptions<Data, Variables>, 'mutation'> = {}
  ) {
    return function loadMutation(apolloClient: ApolloClient<any>) {
      return function executeMutation() {
        return apolloClient.mutate<Data>({ mutation, ...options })
      }
    }
  }
}

// Prepares a mutate function when supplied with the exported function with
// the same name as the mutation operation.
// The React Hooks rules apply - this function must be called unconditionally
// within a functional React Component.
export function useApolloMutation<Data, Variables>(
  configuredMutation: (
    apolloClient: ApolloClient<any>
  ) => ObservableQuery<Data, Variables>
) {
  const { apolloClient } = useContext(apolloContext)
  const mutate = configuredMutation(apolloClient)
  return mutate
}
