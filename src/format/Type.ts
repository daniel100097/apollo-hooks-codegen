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
    let t = ''
    if (type.scalar) {
      t = formatScalarType(type)
      if (t.includes('Saiphe_')) {
        console.log(t)
      }
    }
    if (type.fields) {
      t = formatInterfaceType(type)
    }
    if (type.union) {
      t = formatUnionType(type)
    }

    return t
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
  return _snake2Pascal([...type.namespace, type.name].join('_'))
}
