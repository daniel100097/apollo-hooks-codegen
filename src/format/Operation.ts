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

  if (operationType === 'query') {
    return `
    export const ${operationName}GqlDocument = ${gql}
    
    export function use${operationName}(options?: QueryHookOptions<${_snake2Pascal(
      `${operationDataPrefix}_variables`
    )}>){
      return use${_snake2Pascal(operationType)}<${_snake2Pascal(
      `${operationDataPrefix}_data`
    )}>(${operationName}GqlDocument, options);
    }
      
    ${formatType(variables)}
    ${formatType(data)}
    `
  }

  if (operationType === 'mutation') {
    return `
    export const ${operationName}GqlDocument = ${gql}
    
    export function use${operationName}(options?: MutationHookOptions<
      ${_snake2Pascal(`${operationDataPrefix}_data`)},
      ${_snake2Pascal(`${operationDataPrefix}_variables`)}
    >): [
      MutationHookFn<${_snake2Pascal(
        `${operationDataPrefix}_data`
      )},${_snake2Pascal(`${operationDataPrefix}_variables`)}>,
      MutationResult<${_snake2Pascal(`${operationDataPrefix}_data`)}>
     ]{
       //@ts-ignore
      return use${_snake2Pascal(
        operationType
      )}(${operationName}GqlDocument, options);
    }
      
    ${formatType(variables)}
    ${formatType(data)}
    `
  }

  return `
export const ${operationName}GqlDocument = ${gql}

export function use${operationName}(options?: ${_snake2Pascal(
    operationType
  )}HookOptions<
  ${_snake2Pascal(`${operationDataPrefix}_data`)},
  ${_snake2Pascal(`${operationDataPrefix}_variables`)}
>
){
  return use${_snake2Pascal(
    operationType
  )}(${operationName}GqlDocument, options);
}
  
${formatType(variables)}
${formatType(data)}
`
}
