import type { CompetitionCurrent } from '../types'

interface StatsCardsProps {
  current: CompetitionCurrent
}

export function StatsCards({ current }: StatsCardsProps) {
  const { eval: evalData, subnet, complianceSummary, validatorFleet } = current

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
          <span className="stat-label">Manifest entries</span>
          <strong className="stat-value">{complianceSummary.manifestEntries}</strong>
        </div>
        <div className="stat-card compact">
          <span className="stat-label">Validator fleet</span>
          <strong className="stat-value">{validatorFleet.totalValidators}</strong>
        </div>
        <div className="stat-card compact">
          <span className="stat-label">Subnet block</span>
          <strong className="stat-value">{subnet.blockNumber.toLocaleString()}</strong>
        </div>
      </div>
    </section>
  )
}
