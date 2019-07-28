import { GraphQLSchema } from 'graphql'
import { Types } from '@graphql-codegen/plugin-helpers'
import { PluginConfig, PluginIR } from '../types'
import { setGlobals, InputTypes } from './Globals'
import { transformDocumentFile } from './DocumentFile'

export function transform(
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: PluginConfig
): PluginIR {
  setGlobals(schema, config)

  const files = documents.map(transformDocumentFile)
  const inputTypes = InputTypes()

  return { files, inputTypes }
}
