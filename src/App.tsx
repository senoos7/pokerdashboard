import { useState } from 'react'
import { ContenderSpread } from './components/ContenderSpread'
import { HeroSection } from './components/HeroSection'
import { LeaderboardTable } from './components/LeaderboardTable'
import { MinerDetailPanel } from './components/MinerDetailPanel'
import { StatsCards } from './components/StatsCards'
import { ValidatorFleet } from './components/ValidatorFleet'
import { WinnerHistory } from './components/WinnerHistory'
import { useDashboardData } from './hooks/useDashboardData'
import type { LeaderboardRow } from './types'
import { getRoundSchedule } from './utils/competition'
import './App.css'

function App() {
  const { data, loading, error, lastUpdated, refreshing, refresh } = useDashboardData()
  const [selectedMiner, setSelectedMiner] = useState<LeaderboardRow | null>(null)

  if (loading && !data) {
    return (
      <div className="app-shell">
        <main className="page">
          <p className="panel-message">Loading Poker44 dashboard…</p>
        </main>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="app-shell">
        <main className="page">
          <section className="panel error-panel">
            <h1>Dashboard unavailable</h1>
            <p>{error}</p>
            <button type="button" className="button" onClick={refresh}>
              Try again
            </button>
          </section>
        </main>
      </div>
    )
  }

  if (!data) return null

  const leaderScore = data.leaderboard.rows.find((row) => row.rank === 1)?.compositeScore ?? null
  const roundSchedule = getRoundSchedule(data.leaderboard.rows)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Poker44 subnet 126</p>
          <strong>Poker44 Dashboard</strong>
        </div>
        <a href="https://poker44.net/dashboard" target="_blank" rel="noreferrer">
          Official dashboard
        </a>
      </header>

      <main className="page">
        {error && (
          <section className="panel error-banner">
            <p>Latest refresh failed: {error}</p>
          </section>
        )}

        <HeroSection
          current={data.current}
          roundCount={roundSchedule.length}
          lastUpdated={lastUpdated}
          refreshing={refreshing}
          onRefresh={refresh}
        />

        <StatsCards current={data.current} roundSchedule={roundSchedule} />

        <WinnerHistory
          history={data.history}
          provisionalScore={data.current.provisionalWinner?.compositeScore ?? null}
          provisionalUid={data.current.provisionalWinner?.uid ?? null}
        />

        <ContenderSpread rows={data.leaderboard.rows} leaderScore={leaderScore} />

        <LeaderboardTable
          rows={data.leaderboard.rows}
          roundColumns={roundSchedule}
          status={data.leaderboard.summary.leaderboardStatus}
          onSelectMiner={setSelectedMiner}
        />

        <ValidatorFleet validators={data.validators} />
      </main>

      <MinerDetailPanel row={selectedMiner} onClose={() => setSelectedMiner(null)} />
    </div>
  )
}

export default App
