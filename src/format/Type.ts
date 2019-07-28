import { TypeIR } from '../types'
import { formatInterfaceType } from './Interface'
import { formatScalarType } from './Scalar'
import { formatUnionType } from './Union'
import { _snake2Pascal } from './format'

export function formatType(type: TypeIR): string {
  function lhs() {
    return 'type ' + typeName(type)
  }

  function rhs() {
    if (type.scalar) {
      return formatScalarType(type)
    }
    if (type.fields) {
      return formatInterfaceType(type)
    }
    if (type.union) {
      return formatUnionType(type)
    }
  }

  let output = lhs() + ' = ' + rhs() + '\n'

  for (const field of type.fields || []) {
    output += formatType(field)
  }
  for (const unionPart of type.union || []) {
    output += formatType(unionPart)
  }

  return output
}

export function typeName(type: TypeIR): string {
  const tmp = _snake2Pascal([...type.namespace, type.name].join('_'))
  console.log(tmp)
  return tmp
}
