import type { LeaderboardRow } from '../types'
import { formatScore } from '../utils/format'

interface ContenderSpreadProps {
  rows: LeaderboardRow[]
  leaderScore: number | null
}

export function ContenderSpread({ rows, leaderScore }: ContenderSpreadProps) {
  const contenders = rows
    .filter((row) => row.compositeScore != null)
    .slice(0, 8)
    .reverse()

  if (contenders.length === 0) return null

  const maxScore = leaderScore ?? contenders[contenders.length - 1].compositeScore ?? 1

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Competition race</p>
          <h2>Live contender spread</h2>
        </div>
      </div>

      <div className="spread-chart">
        {contenders.map((row) => {
          const score = row.compositeScore ?? 0
          const width = maxScore > 0 ? (score / maxScore) * 100 : 0
          const gap = leaderScore != null ? leaderScore - score : 0

          return (
            <div key={row.uid} className="spread-row">
              <div className="spread-label">
                <span>UID {row.uid}</span>
                <span>{formatScore(score)}</span>
              </div>
              <div className="spread-bar-track">
                <div
                  className={`spread-bar-fill ${row.rank === 1 ? 'gold' : ''}`}
                  style={{ width: `${width}%` }}
                />
              </div>
              {gap > 0 && row.rank !== 1 && (
                <span className="spread-gap">−{formatScore(gap)}</span>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
