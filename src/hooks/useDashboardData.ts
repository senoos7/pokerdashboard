import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchCompetitionCurrent,
  fetchCompetitionHistory,
  fetchLeaderboard,
  fetchValidatorFleet,
} from '../api/client'
import type {
  CompetitionCurrent,
  CompetitionHistory,
  LeaderboardData,
  ValidatorFleetData,
} from '../types'

const REFRESH_MS = 30 * 60 * 1000

export interface DashboardData {
  leaderboard: LeaderboardData
  current: CompetitionCurrent
  history: CompetitionHistory
  validators: ValidatorFleetData
}

interface DashboardState {
  data: DashboardData | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refreshing: boolean
}

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
    refreshing: false,
  })

  const mountedRef = useRef(true)

  const load = useCallback(async (isRefresh = false) => {
    setState((prev) => ({
      ...prev,
      loading: !isRefresh && !prev.data,
      refreshing: isRefresh,
      error: null,
    }))

    try {
      const [leaderboard, current, history, validators] = await Promise.all([
        fetchLeaderboard(),
        fetchCompetitionCurrent(),
        fetchCompetitionHistory(),
        fetchValidatorFleet(),
      ])

      if (!mountedRef.current) return

      setState({
        data: { leaderboard, current, history, validators },
        loading: false,
        error: null,
        lastUpdated: new Date(),
        refreshing: false,
      })
    } catch (err) {
      if (!mountedRef.current) return
      setState((prev) => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: err instanceof Error ? err.message : 'Failed to load dashboard data',
      }))
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    void load(false)

    const interval = window.setInterval(() => {
      void load(true)
    }, REFRESH_MS)

    return () => {
      mountedRef.current = false
      window.clearInterval(interval)
    }
  }, [load])

  return {
    ...state,
    refresh: () => load(true),
    refreshIntervalMs: REFRESH_MS,
  }
}
