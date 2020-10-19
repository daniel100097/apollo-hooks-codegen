import { Types } from '@graphql-codegen/plugin-helpers'
import { FileIR } from '../types'
import { transformOperationDefinitionNode } from './Operation'
import { transformFragmentDefinitionNode } from './Fragment'
import { OperationDefinitionNode, FragmentDefinitionNode } from 'graphql'

export function transformDocumentFile(file: Types.DocumentFile): FileIR {
      //@ts-ignore
      if (file.content){
         //@ts-ignore
        file.document = file.content;
    }
  
  return {
    //@ts-ignore
    filePath: file.filePath,
    //@ts-ignore
    operations: file.document.definitions
      //@ts-ignore
      .filter(it => it.kind == 'OperationDefinition')
      //@ts-ignore
      .map(node => node as OperationDefinitionNode)
      .map(transformOperationDefinitionNode),
    //@ts-ignore

    fragments: file.document.definitions
      //@ts-ignore
      .filter(it => it.kind == 'FragmentDefinition')
      //@ts-ignore
      .map(node => node as FragmentDefinitionNode)
      .map(transformFragmentDefinitionNode),
  }
}
