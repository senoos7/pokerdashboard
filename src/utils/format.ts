export function formatScore(value: number | null | undefined, digits = 3): string {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toFixed(digits)
}

export function formatPercent(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`
}

export function shortHotkey(hotkey: string, head = 6, tail = 6): string {
  if (hotkey.length <= head + tail + 3) return hotkey
  return `${hotkey.slice(0, head)}...${hotkey.slice(-tail)}`
}

export function shortCommit(commit: string | null | undefined, len = 7): string {
  if (!commit) return '—'
  return commit.slice(0, len)
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export function formatDuration(seconds: number): {
  days: number
  hours: number
  minutes: number
  secs: number
} {
  const total = Math.max(0, Math.floor(seconds))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  return { days, hours, minutes, secs }
}

export function timeAgo(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return `${diffSec} seconds ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`
}

export function cycleProgress(startsAt: string, endsAt: string): number {
  const start = new Date(startsAt).getTime()
  const end = new Date(endsAt).getTime()
  const now = Date.now()
  if (end <= start) return 0
  return Math.min(1, Math.max(0, (now - start) / (end - start)))
}
