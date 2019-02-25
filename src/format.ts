import { PluginIR, FileIR, OperationIR, TypeIR, FragmentIR } from './types'

export function format(plugin: PluginIR): string {
  return join(
    disclaimer,
    imports,
    '',
    formatInputTypes(plugin.inputTypes),
    ...plugin.files.map(formatFile),
    '',
    boilerplate
  )
}

function formatInputTypes(inputTypes: TypeIR[]): string {
  return join(
    '',
    '',
    '/*',
    ' * GraphQL Input Types',
    ' */',
    '',
    ...inputTypes.map(formatType)
  )
}

function formatFile(file: FileIR): string {
  return join(
    '',
    '',
    '/*',
    ' * Fragments from ' + file.filePath,
    ' */',
    '',
    ...file.fragments.map(formatFragments),
    '',
    '/*',
    ' * Operations from ' + file.filePath,
    ' */',
    '',
    ...file.operations.map(formatOperation)
  )
}

function formatFragments(fragmentType: FragmentIR): string {
  return join(
    'export type ' +
      fragmentType.name +
      ' = ' +
      formatInterface(fragmentType.fields),
    '',
    ...fragmentType.fields.map(formatType),
    '',
    'const _gql_' +
      fragmentType.name +
      ' = gql`' +
      fragmentType.gqlExpression +
      '`'
  )
}

function formatOperation(operation: OperationIR): string {
  const {
    name,
    operationType,
    gqlExpression,
    data,
    variables,
    fragments,
  } = operation

  let gqlFragments = fragments
    ? join(...fragments.map(it => '${_gql_' + it + '}'))
    : ''
  let gql = 'gql`' + gqlExpression + gqlFragments + '`'

  return join(
    `export const ${name} = ${operationType}<${name}_variables, ${name}_data>(${gql})`,
    formatType(variables),
    formatType(data),
    ``
  )
}

function typeName(type: TypeIR): string {
  return [...type.namespace, type.name].join('_')
}

function formatType(type: TypeIR): string {
  const leftSide = 'export type ' + typeName(type)
  const fragments = type.fragments ? type.fragments.join(' & ') + ' & ' : ''
  const rightSide = type.scalar || formatInterface(type.fields)

  let output = leftSide + ' = ' + fragments + rightSide

  if (type.fields) {
    output += join('', ...type.fields.map(formatType))
  }

  return output
}

function formatInterface(fields: TypeIR[]) {
  return join('{', ...fields.map(field => indent(formatField(field))), '}')
}

function formatField(field: TypeIR) {
  let type = typeName(field)
  let optional = false
  if (field.modifiers) {
    optional = field.modifiers[0] == 'Nullable'
    for (const modifier of field.modifiers.reverse()) {
      type = modifier + '<' + type + '>'
    }
  }
  return field.name + (optional ? '?: ' : ': ') + type
}

const disclaimer = `
/*
 * This file was generated by graphql-code-generator with the apollo-hooks-codegen plugin.
 * Any changes made to the file will be overwritten.
 */
`

const imports = `
import * as React from 'react'
import { createContext, useEffect, useState, useContext, useRef } from 'react'
import ApolloClient, {
  MutationOptions,
  ObservableQuery,
  WatchQueryOptions,
  SubscriptionOptions,
  ApolloQueryResult,
} from 'apollo-client'
import { FetchResult, Observable } from 'apollo-link'
import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
`

const boilerplate = `
/*
 * Boilerplate
 */

type Nullable<T> = T | null
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type QueryOpts<V> = Omit<WatchQueryOptions<V>, 'query'>
type MutateOpts<D, V> = Omit<MutationOptions<D, V>, 'mutation'>
type SubscriptionOpts<V> = Omit<SubscriptionOptions<V>, 'query'>
type UseQueryResult<D> = Omit<ApolloCurrentResult<D>, 'data'> & {
  data: Nullable<D>
}

// We grab the ApolloClient from this context within our hooks
type ContextType = { apolloClient?: ApolloClient<any> }
const apolloContext = createContext<ContextType>({})

// Must be inserted at the root of all components that want to use the hook
// functions supplied by this file.
export function ApolloHooksProvider({
  children,
  apolloClient,
}: {
  children?: any
  apolloClient: ApolloClient<any> | undefined
}) {
  const elementType = apolloContext.Provider
  const elementProps: React.ProviderProps<ContextType> = {
    value: { apolloClient },
  }
  return React.createElement(elementType, elementProps, children)
}

// Executes a query that has been created by calling the exported function with
// the same name as the query operation.
// The React Hooks rules apply - this function must be called unconditionally
// within a functional React Component and will rerender the component whenever
// the query result changes.
export function useQuery<D, V>(
  configuredQuery: (client: ApolloClient<any>) => ObservableQuery<D, V>,
  queryCallback?: (query: ObservableQuery<D, V>) => void
): UseQueryResult<D> {
  const { apolloClient } = useContext(apolloContext)
  if (!apolloClient) throw 'No ApolloClient provided'

  const queryRef = useRef(configuredQuery(apolloClient))
  const query = queryRef.current

  const [result, setResult] = useState(() => {
    const initialResult = query.currentResult()
    const data =
      initialResult.loading || initialResult.partial
        ? null
        : (initialResult.data as D)
    return { ...initialResult, data }
  })

  useEffect(() => {
    if (queryCallback) {
      queryCallback(query)
    }

    const subscription = query.subscribe(
      currentResult => setResult(currentResult),
      error => setResult({ ...result, error, loading: false })
    )

    return () => subscription.unsubscribe()
  }, [])

  return result
}

// Prepares a mutate function when supplied with the exported function with
// the same name as the mutation operation.
// The React Hooks rules apply - this function must be called unconditionally
// within a functional React Component.
export function useMutation<D, V>(
  configuredMutation: (
    client: ApolloClient<any>
  ) => (opts?: MutateOpts<D, V>) => Promise<FetchResult<D>>
) {
  const { apolloClient } = useContext(apolloContext)
  if (!apolloClient) throw 'No ApolloClient provided'
  const mutate = configuredMutation(apolloClient)
  return mutate
}

export function useSubscription<D>(
  configuredSubscription: (client: ApolloClient<any>) => Observable<{ data: D }>
): Nullable<D> {
  const { apolloClient } = useContext(apolloContext)
  if (!apolloClient) throw 'No ApolloClient provided'

  const observable = useRef(configuredSubscription(apolloClient))

  const [result, setResult] = useState<Nullable<D>>(null)
  useEffect(() => {
    const subscription = observable.current.subscribe(event =>
      setResult(event.data)
    )
    return () => subscription.unsubscribe()
  })
  return result
}

export function useQueryWithSubscription<QD, QV, SD>(
  configuredQuery: (client: ApolloClient<any>) => ObservableQuery<QD, QV>,
  configuredSubscription: (
    client: ApolloClient<any>
  ) => Observable<{ data: SD }>,
  addDataFromSubscription: (queryData: QD, subscriptionData: SD) => QD
): UseQueryResult<QD> {
  const queryResult = useQuery(configuredQuery)
  const subscriptionData = useSubscription(configuredSubscription)

  const [result, setResult] = useState(queryResult)
  if (queryResult != result) setResult(queryResult)
  if (result.data != null && subscriptionData != null) {
    const newData = addDataFromSubscription(result.data, subscriptionData)
    setResult({ ...result, data: newData })
  }
  return result
}

// Converts a gql-snippet into a user-callable function that takes options,
// which can then be passed to useMutation to provide the mutate function.
function mutation<V, D>(mutation: DocumentNode) {
  return function configureMutation(opts: MutateOpts<D, V> = {}) {
    return function loadMutation(client: ApolloClient<any>) {
      return function executeMutation(opts2: MutateOpts<D, V> = {}) {
        return client.mutate<D>({ mutation, ...opts, ...opts2 })
      }
    }
  }
}

// Converts a gql-snippet into a user-callable function that takes options,
// which can then be passed to useQuery to execute the query.
function query<V, D>(doc: DocumentNode) {
  return function configureQuery(opts: QueryOpts<V> = {}) {
    return function executeQuery(client: ApolloClient<any>) {
      return client.watchQuery<D>({ query: doc, ...opts })
    }
  }
}

function subscription<V, D>(doc: DocumentNode) {
  return function configureSubscription(opts: SubscriptionOpts<V> = {}) {
    return function executeSubscription(client: ApolloClient<any>) {
      return client.subscribe<{ data: D }, V>({ query: doc, ...opts })
    }
  }
}

`

function join(...lines: string[]) {
  return lines.join('\n')
}

function indent(multilineText: string, offset: string = '  ') {
  return multilineText
    .trim()
    .split('\n')
    .map(line => offset + line)
    .join('\n')
}
