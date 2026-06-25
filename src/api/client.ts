import type {
  ApiResponse,
  CompetitionCurrent,
  CompetitionHistory,
  LeaderboardData,
  MinerDetail,
  ValidatorFleetData,
} from '../types'

const API_BASE = '/api/v1'

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${path}`)
  }

  const payload = (await response.json()) as ApiResponse<T>
  if (!payload.success || !payload.data) {
    throw new Error(payload.error?.message ?? `API error for ${path}`)
  }

  return payload.data
}

export function fetchLeaderboard() {
  return fetchApi<LeaderboardData>('/competition/leaderboard')
}

export function fetchCompetitionCurrent() {
  return fetchApi<CompetitionCurrent>('/competition/current')
}

export function fetchCompetitionHistory() {
  return fetchApi<CompetitionHistory>('/competition/history')
}

export function fetchValidatorFleet() {
  return fetchApi<ValidatorFleetData>('/network/validators')
}

export function fetchMinerDetail(uid: number) {
  return fetchApi<MinerDetail>(`/miners/${uid}`)
}
