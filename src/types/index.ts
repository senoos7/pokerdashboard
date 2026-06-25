export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: { code: string; message: string }
}

export interface WindowScore {
  roundIndex: number
  windowStart: string
  windowEnd: string
  compositeScore: number | null
  state: string
}

export interface LeaderboardRow {
  rank: number | null
  uid: number
  hotkey: string
  modelName: string | null
  modelVersion: string | null
  repoUrl: string | null
  repoCommit: string | null
  complianceStatus: string | null
  manifestPresent: boolean
  active: boolean
  scoreSource: string | null
  compositeScore: number | null
  reward: number | null
  rankingQuality: number | null
  classificationQuality: number | null
  calibrationQuality: number | null
  coverageQuality: number | null
  latencyQuality: number | null
  humanSafetyPenalty: number | null
  coverageRate: number | null
  latencyMeanSeconds: number | null
  sampleCount: number | null
  reportingValidators: number | null
  incentive: number | null
  emission: number | null
  validatorTrust: number | null
  totalAlphaStake: number | null
  updatedBlocks: number | null
  registeredAt: string | null
  updatedAt: string | null
  identityKey: string | null
  manifestReviewFailed: boolean
  manifestReviewMessage: string | null
  windowCompositeScores: WindowScore[]
}

export interface LeaderboardData {
  epoch: CompetitionEpoch
  summary: {
    totalRows: number
    settlementMode: string
    leaderboardStatus: string
  }
  latestSettledWinner: SettledWinner | null
  rows: LeaderboardRow[]
}

export interface CompetitionEpoch {
  epochId: string
  cadence: string
  settlementMode: string
  startsAt: string
  endsAt: string
  secondsRemaining: number
}

export interface SettledWinner {
  epochId: string
  uid: number
  hotkey: string
  settledAt: string
  compositeScore: number
  modelName: string
  modelVersion?: string
  cadence?: string
  canonicalCompetition?: boolean
  repoUrl?: string
  repoCommit?: string
}

export interface CompetitionCurrent {
  generatedAt: string
  epoch: CompetitionEpoch
  status: {
    leaderboardStatus: string
    settlementMode: string
    explanation: string
  }
  subnet: {
    netuid: number
    blockNumber: number
    totalNeurons: number
    activeNeurons: number
    activeValidators: number
    activeMiners: number
  }
  eval: {
    availableHands: number
    readyForEvaluation: boolean
    hasActiveChunk: boolean
    activeChunkId: string
    activeChunkHash: string
    activeChunkHandCount: number
    activeWindowStart: string
    activeWindowEnd: string
  }
  validatorFleet: {
    totalValidators: number
    byDeployVersion: Record<string, number>
    latestUpdatedAt: string
  }
  complianceSummary: {
    trackedMiners: number
    transparentMiners: number
    opaqueMiners: number
    manifestEntries: number
  }
  provisionalWinner: {
    uid: number
    hotkey: string
    modelName: string
    modelVersion: string
    compositeScore: number
    scoreSource: string
    reportingValidators: number
  } | null
  latestSettledWinner: SettledWinner | null
}

export interface CompetitionHistory {
  generatedAt: string
  summary: {
    totalSettledEpochs: number
    canonicalCompetitionCloses: number
    legacyDailyCloses: number
    limitApplied: number
  }
  winners: SettledWinner[]
}

export interface ValidatorRecord {
  hotkey: string
  updatedAt: string
  uid: number | null
  deployVersion: string
  version: string
  commit: string
  gitDirty: boolean
  directSync: boolean
  step: number
  nonzeroScores: number
  coverageRoundIndex: number
  coverageRoundSeenCount: number
  coverageRoundExpectedCount: number
}

export interface ValidatorFleetData {
  summary: {
    totalValidators: number
    byDeployVersion: Record<string, number>
    latestUpdatedAt: string
  }
  records: ValidatorRecord[]
}

export interface MinerManifest {
  framework?: string
  implementation_files?: string[]
  implementation_sha256?: string
  inference_mode?: string
  license?: string
  model_name?: string
  model_version?: string
  notes?: string
  open_source?: boolean
  private_data_attestation?: string
  repo_commit?: string
  repo_url?: string
  schema_version?: string
  training_data_sources?: string[]
  training_data_statement?: string
  artifact_url?: string
  [key: string]: unknown
}

export interface MinerDetail {
  uid: number
  hotkey: string
  active: boolean
  updatedBlocks: number
  rank: number | null
  emission: string
  emissionShare: string
  incentive: string
  incentiveShare: string
  dividends: string
  validatorTrust: string
  totalAlphaStake: string
  manifestPresent: boolean
  complianceStatus: string
  modelName: string | null
  repoUrl: string | null
  repoCommit: string | null
  manifestUpdatedAt: string | null
  subnet: Record<string, unknown>
  manifest: MinerManifest | null
  compliance: Record<string, unknown> | null
  axon: { ip?: string; port?: number } | null
}

export type SortDirection = 'asc' | 'desc'

export type SortKey =
  | 'rank'
  | 'uid'
  | 'modelName'
  | 'compositeScore'
  | 'reward'
  | 'sampleCount'
  | `r${number}`
