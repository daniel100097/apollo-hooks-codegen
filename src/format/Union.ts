import { TypeIR } from '../types'
import { _snake2Pascal } from './format'

export function formatUnionType(type: TypeIR) {
  return type
    .union!.map(t => _snake2Pascal([...t.namespace, t.name].join('_')))
    .join(' | ')
}
