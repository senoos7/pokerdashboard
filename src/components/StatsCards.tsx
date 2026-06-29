import type { CompetitionCurrent, WindowScore } from '../types'
import { formatRoundWindow, getActiveRound } from '../utils/competition'
import { formatDateTime } from '../utils/format'

interface StatsCardsProps {
  current: CompetitionCurrent
  roundSchedule: WindowScore[]
}

export function StatsCards({ current, roundSchedule }: StatsCardsProps) {
  const { eval: evalData, subnet, complianceSummary, validatorFleet } = current
  const activeRound = getActiveRound(roundSchedule)

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Cards on the table</p>
          <h2>Live benchmark snapshot</h2>
        </div>
        <span className="badge">{current.status.leaderboardStatus}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card compact">
          <span className="stat-label">Active round</span>
          <strong className="stat-value">{activeRound ? `R${activeRound.roundIndex}` : '—'}</strong>
          <p className="meta-line">
            {activeRound ? formatRoundWindow(activeRound) : 'No active round'}
          </p>
        </div>
        <div className="stat-card compact">
          <span className="stat-label">Round window</span>
          <strong className="stat-value compact-text">
            {activeRound ? formatDateTime(activeRound.windowEnd) : '—'}
          </strong>
          <p className="meta-line">Current window closes</p>
        </div>
        <div className="stat-card compact">
          <span className="stat-label">Hands available</span>
          <strong className="stat-value">{evalData.availableHands.toLocaleString()}</strong>
        </div>
        <div className="stat-card compact">
          <span className="stat-label">Active chunk hands</span>
          <strong className="stat-value">{evalData.activeChunkHandCount.toLocaleString()}</strong>
        </div>
        <div className="stat-card compact">
          <span className="stat-label">Active miners</span>
          <strong className="stat-value">{subnet.activeMiners}</strong>
        </div>
        <div className="stat-card compact">
          <span className="stat-label">Active validators</span>
          <strong className="stat-value">{subnet.activeValidators}</strong>
        </div>
        <div className="stat-card compact">
          <span className="stat-label">Tracked miners</span>
          <strong className="stat-value">{complianceSummary.trackedMiners}</strong>
        </div>
        <div className="stat-card compact">
          <span className="stat-label">Validator fleet</span>
          <strong className="stat-value">{validatorFleet.totalValidators}</strong>
        </div>
      </div>
    </section>
  )
}
