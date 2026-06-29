import type { CompetitionCurrent } from '../types'
import { formatCadence } from '../utils/competition'
import { cycleProgress, formatDateTime, formatPercent, formatScore } from '../utils/format'
import { CountdownTimer } from './CountdownTimer'

interface HeroSectionProps {
  current: CompetitionCurrent
  roundCount: number
  lastUpdated: Date | null
  refreshing: boolean
  onRefresh: () => void
}

export function HeroSection({
  current,
  roundCount,
  lastUpdated,
  refreshing,
  onRefresh,
}: HeroSectionProps) {
  const progress = cycleProgress(current.epoch.startsAt, current.epoch.endsAt)
  const winner = current.provisionalWinner
  const cycleLabel = formatCadence(current.epoch.cadence)

  return (
    <section className="panel hero-panel">
      <div className="hero-top">
        <div>
          <p className="eyebrow">Competition live now</p>
          <h1>One winner per {cycleLabel.toLowerCase()}.</h1>
          <p className="muted">
            {roundCount} scoring rounds per cycle. Scores stay provisional until settlement at{' '}
            {formatDateTime(current.epoch.endsAt)}.
          </p>
          {current.status.explanation && <p className="meta-line">{current.status.explanation}</p>}
        </div>
        <div className="hero-actions">
          <button type="button" className="button secondary" onClick={onRefresh} disabled={refreshing}>
            {refreshing ? 'Refreshing…' : 'Refresh now'}
          </button>
          {lastUpdated && (
            <p className="meta-line">
              Updated {lastUpdated.toLocaleTimeString()} · auto-refresh every 30 min
            </p>
          )}
        </div>
      </div>

      <div className="hero-grid">
        <div className="stat-card highlight">
          <span className="stat-label">Time to settlement</span>
          <CountdownTimer secondsRemaining={current.epoch.secondsRemaining} />
          <p className="meta-line">Closes {formatDateTime(current.epoch.endsAt)}</p>
        </div>

        <div className="stat-card">
          <span className="stat-label">Cycle progress</span>
          <strong className="stat-value">{formatPercent(progress, 0)}</strong>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="meta-line">{current.epoch.epochId}</p>
        </div>

        <div className="stat-card">
          <span className="stat-label">Scoring rounds</span>
          <strong className="stat-value">{roundCount}</strong>
          <p className="meta-line">Cadence {current.epoch.cadence}</p>
        </div>

        <div className="stat-card">
          <span className="stat-label">Provisional winner</span>
          {winner ? (
            <>
              <strong className="stat-value gold">{formatScore(winner.compositeScore)}</strong>
              <p className="meta-line">
                UID {winner.uid} · {winner.modelName}
              </p>
            </>
          ) : (
            <strong className="stat-value">—</strong>
          )}
        </div>

        <div className="stat-card">
          <span className="stat-label">Last settled winner</span>
          {current.latestSettledWinner ? (
            <>
              <strong className="stat-value">{formatScore(current.latestSettledWinner.compositeScore)}</strong>
              <p className="meta-line">UID {current.latestSettledWinner.uid}</p>
            </>
          ) : (
            <strong className="stat-value">—</strong>
          )}
        </div>
      </div>
    </section>
  )
}
