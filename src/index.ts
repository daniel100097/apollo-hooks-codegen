import { PluginConfig } from './types'
import { transform } from './transform'
import { format } from './format'
import { GraphQLSchema } from 'graphql'
import { Types } from '@graphql-codegen/plugin-helpers'

export function plugin(
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: PluginConfig
): string {
  try {
    const pluginIR = transform(schema, documents, config)
    return format(pluginIR)
  } catch (e) {
    console.log(e)
    return ''
  }
}
