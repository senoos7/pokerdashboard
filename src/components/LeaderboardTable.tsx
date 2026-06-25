import { useMemo, useState } from 'react'
import type { LeaderboardRow, SortDirection, SortKey } from '../types'
import { formatScore, shortCommit, shortHotkey } from '../utils/format'

interface LeaderboardTableProps {
  rows: LeaderboardRow[]
  status: string
  onSelectMiner: (row: LeaderboardRow) => void
}

function getRoundScore(row: LeaderboardRow, roundIndex: number): number | null {
  const round = row.windowCompositeScores.find((item) => item.roundIndex === roundIndex)
  return round?.compositeScore ?? null
}

function compareNullableNumbers(a: number | null, b: number | null, direction: SortDirection): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  return direction === 'asc' ? a - b : b - a
}

function compareStrings(a: string | null | undefined, b: string | null | undefined, direction: SortDirection): number {
  const left = (a ?? '').toLowerCase()
  const right = (b ?? '').toLowerCase()
  const result = left.localeCompare(right)
  return direction === 'asc' ? result : -result
}

function sortRows(rows: LeaderboardRow[], sortKey: SortKey, direction: SortDirection): LeaderboardRow[] {
  const sorted = [...rows]

  sorted.sort((a, b) => {
    switch (sortKey) {
      case 'rank':
        return compareNullableNumbers(a.rank, b.rank, direction)
      case 'uid':
        return direction === 'asc' ? a.uid - b.uid : b.uid - a.uid
      case 'modelName':
        return compareStrings(a.modelName, b.modelName, direction)
      case 'compositeScore':
        return compareNullableNumbers(a.compositeScore, b.compositeScore, direction)
      case 'reward':
        return compareNullableNumbers(a.reward, b.reward, direction)
      case 'sampleCount':
        return compareNullableNumbers(a.sampleCount, b.sampleCount, direction)
      default: {
        if (sortKey.startsWith('r')) {
          const roundIndex = Number(sortKey.slice(1))
          return compareNullableNumbers(
            getRoundScore(a, roundIndex),
            getRoundScore(b, roundIndex),
            direction,
          )
        }
        return 0
      }
    }
  })

  return sorted
}

function matchesSearch(row: LeaderboardRow, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const roundScores = row.windowCompositeScores
    .map((round) => round.compositeScore)
    .filter((score) => score != null)
    .map((score) => score!.toFixed(3))

  const haystack = [
    String(row.uid),
    row.hotkey,
    row.modelName,
    row.modelVersion,
    row.repoCommit,
    row.complianceStatus,
    row.compositeScore?.toFixed(3),
    ...roundScores,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(q)
}

const ROUND_COLUMNS = Array.from({ length: 12 }, (_, index) => index + 1)

export function LeaderboardTable({ rows, status, onSelectMiner }: LeaderboardTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('compositeScore')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const filteredRows = useMemo(() => {
    const filtered = rows.filter((row) => matchesSearch(row, search))
    return sortRows(filtered, sortKey, sortDirection)
  }, [rows, search, sortKey, sortDirection])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDirection(key === 'modelName' || key === 'uid' ? 'asc' : 'desc')
  }

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return '↕'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <section className="panel leaderboard-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Provisional standings</p>
          <h2>Live ranking in motion</h2>
          <p className="muted">Click any miner row to inspect manifest and full API details.</p>
        </div>
        <span className="badge">{status}</span>
      </div>

      <div className="table-toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search by UID, hotkey, model, version, commit, score…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <span className="meta-line">
          Showing {filteredRows.length} of {rows.length} miners
        </span>
      </div>

      <div className="table-wrap">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>
                <button type="button" className="sort-button" onClick={() => handleSort('rank')}>
                  Rank {sortIndicator('rank')}
                </button>
              </th>
              <th>
                <button type="button" className="sort-button" onClick={() => handleSort('uid')}>
                  Miner {sortIndicator('uid')}
                </button>
              </th>
              <th>
                <button type="button" className="sort-button" onClick={() => handleSort('modelName')}>
                  Model {sortIndicator('modelName')}
                </button>
              </th>
              <th>
                <button type="button" className="sort-button" onClick={() => handleSort('compositeScore')}>
                  Composite {sortIndicator('compositeScore')}
                </button>
              </th>
              {ROUND_COLUMNS.map((roundIndex) => (
                <th key={roundIndex}>
                  <button
                    type="button"
                    className="sort-button"
                    onClick={() => handleSort(`r${roundIndex}`)}
                  >
                    R{roundIndex} {sortIndicator(`r${roundIndex}`)}
                  </button>
                </th>
              ))}
              <th>
                <button type="button" className="sort-button" onClick={() => handleSort('reward')}>
                  Reward {sortIndicator('reward')}
                </button>
              </th>
              <th>
                <button type="button" className="sort-button" onClick={() => handleSort('sampleCount')}>
                  Samples {sortIndicator('sampleCount')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr
                key={row.uid}
                className={`clickable ${row.rank === 1 ? 'leader-row' : ''}`}
                onClick={() => onSelectMiner(row)}
              >
                <td>{row.rank != null ? `#${row.rank}` : '—'}</td>
                <td>
                  <div className="cell-stack">
                    <strong>UID {row.uid}</strong>
                    <span className="meta-line">{shortHotkey(row.hotkey)}</span>
                  </div>
                </td>
                <td>
                  <div className="cell-stack">
                    <strong>{row.modelName ?? '—'}</strong>
                    <span className="meta-line">
                      {row.modelVersion ?? '—'} · {shortCommit(row.repoCommit)}
                    </span>
                  </div>
                </td>
                <td className="score-cell">{formatScore(row.compositeScore)}</td>
                {ROUND_COLUMNS.map((roundIndex) => (
                  <td key={roundIndex} className="score-cell">
                    {formatScore(getRoundScore(row, roundIndex))}
                  </td>
                ))}
                <td className="score-cell">{formatScore(row.reward)}</td>
                <td>{row.sampleCount ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
