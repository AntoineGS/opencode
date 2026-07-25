/** Resolves whether startup may render before initial synchronization settles. */
export function resolveSkipInitialLoading(noFastBoot: string | undefined) {
  return !noFastBoot
}

type MetadataStatus = "loading" | "complete" | "error"

export function resolveModelMetadataGate(provider: MetadataStatus, agent: MetadataStatus) {
  if (provider === "loading" || agent === "loading") return "loading" as const
  if (provider === "error" || agent === "error") return "unavailable" as const
  return "ready" as const
}

export function startupPromptReady(input: {
  prompt: string
  provider: MetadataStatus
  agent: MetadataStatus
  command: MetadataStatus
  hasModel: boolean
}) {
  if (resolveModelMetadataGate(input.provider, input.agent) !== "ready") return false
  if (!input.hasModel) return false
  return !input.prompt.startsWith("/") || input.command === "complete"
}

/** Resolves paste-summary state, with a stored user choice taking precedence. */
export function resolvePasteSummaryEnabled(stored: boolean | undefined, disabledByConfig: boolean | undefined) {
  return stored ?? !disabledByConfig
}

/**
 * Creates the accessor used by the app so synchronized config remains a live
 * default until the user stores an explicit override.
 */
export function createPasteSummaryEnabled(
  readStored: () => boolean | undefined,
  readDisabledByConfig: () => boolean | undefined,
) {
  return () => resolvePasteSummaryEnabled(readStored(), readDisabledByConfig())
}
