import type { LeaderboardRow, WindowScore } from '../types'
import { formatDateTime } from './format'

export function getRoundSchedule(rows: LeaderboardRow[]): WindowScore[] {
  const roundsByIndex = new Map<number, WindowScore>()

  for (const row of rows) {
    for (const round of row.windowCompositeScores) {
      if (!roundsByIndex.has(round.roundIndex)) {
        roundsByIndex.set(round.roundIndex, round)
      }
    }
  }

  return Array.from(roundsByIndex.values()).sort((a, b) => a.roundIndex - b.roundIndex)
}

export function getActiveRound(rounds: WindowScore[]): WindowScore | null {
  return rounds.find((round) => round.state === 'active') ?? null
}

export function formatCadence(cadence: string | null | undefined): string {
  switch (cadence) {
    case '132h':
      return '5-round competition cycle (132h)'
    case '120h':
      return '5-day competition cycle (120h)'
    case '72h':
      return '72-hour competition cycle'
    case 'daily':
      return 'Daily competition cycle'
    default:
      return cadence ? `${cadence} competition cycle` : 'Competition cycle'
  }
}

export function formatWinnerCadence(cadence: string | null | undefined): string {
  switch (cadence) {
    case '132h':
      return '5-round competition'
    case '120h':
      return 'Legacy 5-day competition'
    case '72h':
      return 'Legacy 72h competition'
    case 'daily':
      return 'Legacy daily'
    default:
      return cadence ?? 'Competition'
  }
}

export function formatRoundWindow(round: WindowScore): string {
  const start = new Date(round.windowStart).getTime()
  const end = new Date(round.windowEnd).getTime()
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return formatDateTime(round.windowStart)
  }

  const hours = Math.round((end - start) / (1000 * 60 * 60))
  return `${hours}h · ${round.state}`
}

export function formatRoundHeader(round: WindowScore): string {
  return `R${round.roundIndex}: ${formatDateTime(round.windowStart)} → ${formatDateTime(round.windowEnd)} (${round.state})`
}
