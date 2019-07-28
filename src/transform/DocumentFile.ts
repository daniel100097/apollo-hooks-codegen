import { Types } from '@graphql-codegen/plugin-helpers'
import { FileIR } from '../types'
import { transformOperationDefinitionNode } from './Operation'
import { transformFragmentDefinitionNode } from './Fragment'
import { OperationDefinitionNode, FragmentDefinitionNode } from 'graphql'

export function transformDocumentFile(file: Types.DocumentFile): FileIR {
  return {
    filePath: file.filePath,
    operations: file.content.definitions
      .filter(it => it.kind == 'OperationDefinition')
      .map(node => node as OperationDefinitionNode)
      .map(transformOperationDefinitionNode),
    fragments: file.content.definitions
      .filter(it => it.kind == 'FragmentDefinition')
      .map(node => node as FragmentDefinitionNode)
      .map(transformFragmentDefinitionNode),
  }
}
