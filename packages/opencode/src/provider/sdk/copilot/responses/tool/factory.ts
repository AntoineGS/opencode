import * as util from "@ai-sdk/provider-utils"

type Factory = typeof util.createProviderToolFactory
type OutputFactory = typeof util.createProviderToolFactoryWithOutputSchema

const compat = util as typeof util & {
  createProviderDefinedToolFactory?: Factory
  createProviderDefinedToolFactoryWithOutputSchema?: OutputFactory
}

export const createFactory =
  compat.createProviderDefinedToolFactory ??
  util.createProviderToolFactory

export const createFactoryWithOutput =
  compat.createProviderDefinedToolFactoryWithOutputSchema ??
  util.createProviderToolFactoryWithOutputSchema
