import { OperationIR } from '../types'
import { formatType } from './Type'
import { _snake2Pascal } from './format'

export function formatOperation(operation: OperationIR): string {
  const {
    name,
    operationType,
    gqlExpression,
    data,
    variables,
    fragments,
  } = operation

  let gqlFragments = fragments
    ? fragments.map(it => '${_gql_' + it + '}').join('\n')
    : ''

  let gql = 'gql`' + gqlExpression + gqlFragments + '`'

  const operationName = _snake2Pascal(`${operationType}_${name}`)
  const operationDataPrefix = _snake2Pascal(`${name}`)

  const hookDataInterface = `${_snake2Pascal(
    `${operationDataPrefix}_data`
  )},${_snake2Pascal(`${operationDataPrefix}_variables`)}`

  const hookName = `use${operationName}`

  if (operationType === 'query') {
    return `
    ${hookName}.Document = ${gql} as DocumentNode;
    
    export function ${hookName}(options?: QueryHookOptions<${hookDataInterface}>){
      const result = useQuery<${hookDataInterface}>(${hookName}.Document, {...queryDefaultOptions, ...options});
      if (result.data && !Object.keys(result.data).length){
        delete result.data;
      }
      return result;
    }

    ${hookName}.lazy = function (options?: LazyQueryHookOptions<${hookDataInterface}>){
      return useLazyQuery(${hookName}.Document, {...lazyQueryDefaultOptions, ...options});
    }
      
    ${formatType(variables)}
    ${formatType(data)}
    `
  }

  if (operationType === 'mutation') {
    return `
    ${hookName}.Document = ${gql} as DocumentNode;
    
    export function use${operationName}(options?: MutationHookOptions<${hookDataInterface}>): MutationHookFn<${hookDataInterface}>{
      return useMutation<${hookDataInterface}>(${hookName}.Document, {...mutationDefaultOptions, ...options}) as any;
    }
      
    ${formatType(variables)}
    ${formatType(data)}
    `
  }

  if (operationType === 'subscription') {
    return `
    ${hookName}.Document = ${gql} as DocumentNode;
    
    export function use${operationName}(options?: SubscriptionHookOptions<${hookDataInterface}>){
      return useSubscription<${hookDataInterface}>(${hookName}.Document, {...subscriptionDefaultOptions, ...options});
    }
      
    ${formatType(variables)}
    ${formatType(data)}
    `
  }

  throw new Error(`Unknown operation ${operationName}`)
}
