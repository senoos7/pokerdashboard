import type { ValidatorFleetData } from '../types'
import { shortHotkey, timeAgo } from '../utils/format'

interface ValidatorFleetProps {
  validators: ValidatorFleetData
}

export function ValidatorFleet({ validators }: ValidatorFleetProps) {
  const activeRecords = validators.records
    .filter((record) => record.uid != null)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const deployMix = Object.entries(validators.summary.byDeployVersion)
    .map(([version, count]) => `${version}:${count}`)
    .join(' · ')

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Validators</p>
          <h2>Fleet summary</h2>
          <p className="meta-line">Deploy mix: {deployMix}</p>
        </div>
        <span className="badge">{validators.summary.totalValidators} total</span>
      </div>

      <div className="validator-grid">
        {activeRecords.map((record) => (
          <article key={record.hotkey} className="validator-card">
            <div className="validator-card-top">
              <strong>{record.uid != null ? `UID ${record.uid}` : 'Unknown UID'}</strong>
              <span className="meta-line">{timeAgo(record.updatedAt)}</span>
            </div>
            <p className="meta-line">{shortHotkey(record.hotkey, 5, 5)}</p>
            <div className="validator-meta">
              <span>v{record.deployVersion}</span>
              <span>commit {record.commit || 'unknown'}</span>
            </div>
            <div className="validator-meta">
              <span>Step {record.step}</span>
              <span>{record.nonzeroScores} nonzero</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
