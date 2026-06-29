import type { CompetitionHistory, SettledWinner } from '../types'
import { formatWinnerCadence } from '../utils/competition'
import { formatDateTime, formatScore, shortCommit } from '../utils/format'

interface WinnerHistoryProps {
  history: CompetitionHistory
  provisionalScore: number | null
  provisionalUid: number | null
}

function winnerLabel(winner: SettledWinner): string {
  if (winner.canonicalCompetition === false) return 'Legacy daily'
  return formatWinnerCadence(winner.cadence)
}

export function WinnerHistory({
  history,
  provisionalScore,
  provisionalUid,
}: WinnerHistoryProps) {
  const winners = [...history.winners].reverse()

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Winner history</p>
          <h2>Historical cycle closes</h2>
        </div>
        <div className="meta-stack">
          <span className="meta-line">
            {history.summary.canonicalCompetitionCloses} competition ·{' '}
            {history.summary.legacyDailyCloses} legacy daily
          </span>
        </div>
      </div>

      <div className="history-strip">
        {winners.map((winner) => (
          <div key={winner.epochId} className="history-node">
            <span className="history-score">{formatScore(winner.compositeScore)}</span>
            <span className="history-uid">UID {winner.uid}</span>
            <span className="history-date">{formatDateTime(winner.settledAt)}</span>
          </div>
        ))}
        {provisionalUid != null && (
          <div className="history-node live">
            <span className="history-score">{formatScore(provisionalScore)}</span>
            <span className="history-uid">UID {provisionalUid}</span>
            <span className="history-date">Now · provisional</span>
          </div>
        )}
      </div>

      <div className="history-list">
        {history.winners
          .slice()
          .reverse()
          .map((winner) => (
            <article key={winner.epochId} className="history-card">
              <div>
                <strong>{formatDateTime(winner.settledAt)}</strong>
                <p className="meta-line">{winnerLabel(winner)}</p>
              </div>
              <div>
                <p>UID {winner.uid}</p>
                <p className="meta-line">{winner.modelName}</p>
              </div>
              <div>
                <strong>{formatScore(winner.compositeScore)}</strong>
                <p className="meta-line">{shortCommit(winner.repoCommit)}</p>
              </div>
            </article>
          ))}
      </div>
    </section>
  )
}
