import { useEffect, useState } from 'react'
import { formatDuration } from '../utils/format'

export function CountdownTimer({ secondsRemaining }: { secondsRemaining: number }) {
  const [remaining, setRemaining] = useState(secondsRemaining)

  useEffect(() => {
    setRemaining(secondsRemaining)
  }, [secondsRemaining])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const { days, hours, minutes, secs } = formatDuration(remaining)

  return (
    <div className="countdown">
      {days > 0 && (
        <div className="countdown-unit">
          <span className="countdown-value">{days}</span>
          <span className="countdown-label">Days</span>
        </div>
      )}
      <div className="countdown-unit">
        <span className="countdown-value">{String(hours).padStart(2, '0')}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value">{String(minutes).padStart(2, '0')}</span>
        <span className="countdown-label">Minutes</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-value">{String(secs).padStart(2, '0')}</span>
        <span className="countdown-label">Seconds</span>
      </div>
    </div>
  )
}
