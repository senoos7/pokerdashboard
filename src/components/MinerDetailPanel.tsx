import { useEffect, useState, type ReactNode } from 'react'
import { fetchMinerDetail } from '../api/client'
import type { LeaderboardRow, MinerDetail } from '../types'
import { formatDateTime, formatScore, shortCommit, shortHotkey, timeAgo } from '../utils/format'

interface MinerDetailPanelProps {
  row: LeaderboardRow | null
  onClose: () => void
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  )
}

export function MinerDetailPanel({ row, onClose }: MinerDetailPanelProps) {
  const [detail, setDetail] = useState<MinerDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!row) {
      setDetail(null)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchMinerDetail(row.uid)
      .then((data) => {
        if (!cancelled) {
          setDetail(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load miner detail')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [row])

  if (!row) return null

  const manifest = detail?.manifest

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="drawer"
        onClick={(event) => event.stopPropagation()}
        aria-label={`Miner UID ${row.uid} details`}
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Miner detail</p>
            <h2>UID {row.uid}</h2>
            <p className="meta-line">{shortHotkey(row.hotkey, 8, 8)}</p>
          </div>
          <button type="button" className="button ghost" onClick={onClose}>
            Close
          </button>
        </div>

        {loading && <p className="panel-message">Loading miner details…</p>}
        {error && <p className="panel-message error">{error}</p>}

        {!loading && !error && (
          <div className="drawer-content">
            <section className="detail-section">
              <h3>Leaderboard snapshot</h3>
              <DetailRow label="Rank" value={row.rank ?? '—'} />
              <DetailRow label="Composite" value={formatScore(row.compositeScore)} />
              <DetailRow label="Reward" value={formatScore(row.reward)} />
              <DetailRow label="Samples" value={row.sampleCount ?? '—'} />
              <DetailRow label="Reporting validators" value={row.reportingValidators ?? '—'} />
              <DetailRow label="Compliance" value={row.complianceStatus ?? '—'} />
              <DetailRow label="Updated" value={formatDateTime(row.updatedAt)} />
            </section>

            <section className="detail-section">
              <h3>Model</h3>
              <DetailRow label="Model name" value={row.modelName ?? detail?.modelName ?? '—'} />
              <DetailRow label="Model version" value={row.modelVersion ?? manifest?.model_version ?? '—'} />
              <DetailRow
                label="Repo"
                value={
                  row.repoUrl ? (
                    <a href={row.repoUrl} target="_blank" rel="noreferrer">
                      {row.repoUrl}
                    </a>
                  ) : (
                    '—'
                  )
                }
              />
              <DetailRow label="Commit" value={shortCommit(row.repoCommit ?? detail?.repoCommit)} />
            </section>

            {detail && (
              <section className="detail-section">
                <h3>Subnet & axon</h3>
                <DetailRow label="Active" value={detail.active ? 'Yes' : 'No'} />
                <DetailRow label="Emission" value={detail.emission} />
                <DetailRow label="Incentive" value={detail.incentive} />
                <DetailRow label="Validator trust" value={detail.validatorTrust} />
                <DetailRow label="Alpha stake" value={detail.totalAlphaStake} />
                <DetailRow label="Updated blocks" value={detail.updatedBlocks} />
                <DetailRow
                  label="Axon"
                  value={
                    detail.axon?.ip
                      ? `${detail.axon.ip}:${detail.axon.port ?? '?'}`
                      : '—'
                  }
                />
                <DetailRow label="Manifest updated" value={timeAgo(detail.manifestUpdatedAt)} />
              </section>
            )}

            {manifest && (
              <section className="detail-section">
                <h3>Manifest</h3>
                <DetailRow label="Schema version" value={manifest.schema_version ?? '—'} />
                <DetailRow label="Framework" value={manifest.framework ?? '—'} />
                <DetailRow label="Inference mode" value={manifest.inference_mode ?? '—'} />
                <DetailRow label="License" value={manifest.license ?? '—'} />
                <DetailRow label="Open source" value={manifest.open_source ? 'Yes' : 'No'} />
                <DetailRow
                  label="Implementation SHA256"
                  value={<code className="code-block">{manifest.implementation_sha256 ?? '—'}</code>}
                />
                {manifest.implementation_files && manifest.implementation_files.length > 0 && (
                  <div className="detail-row stack">
                    <span className="detail-label">Implementation files</span>
                    <ul className="file-list">
                      {manifest.implementation_files.map((file) => (
                        <li key={file}>
                          <code>{file}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {manifest.training_data_sources && manifest.training_data_sources.length > 0 && (
                  <DetailRow
                    label="Training data sources"
                    value={manifest.training_data_sources.join(', ')}
                  />
                )}
                {manifest.training_data_statement && (
                  <div className="detail-row stack">
                    <span className="detail-label">Training data statement</span>
                    <p className="detail-text">{manifest.training_data_statement}</p>
                  </div>
                )}
                {manifest.private_data_attestation && (
                  <div className="detail-row stack">
                    <span className="detail-label">Private data attestation</span>
                    <p className="detail-text">{manifest.private_data_attestation}</p>
                  </div>
                )}
                {manifest.notes && (
                  <div className="detail-row stack">
                    <span className="detail-label">Notes</span>
                    <p className="detail-text">{manifest.notes}</p>
                  </div>
                )}
                {manifest.artifact_url && (
                  <DetailRow
                    label="Artifact URL"
                    value={
                      <a href={String(manifest.artifact_url)} target="_blank" rel="noreferrer">
                        {String(manifest.artifact_url)}
                      </a>
                    }
                  />
                )}
              </section>
            )}

            {detail?.compliance && (
              <section className="detail-section">
                <h3>Compliance</h3>
                <pre className="json-block">{JSON.stringify(detail.compliance, null, 2)}</pre>
              </section>
            )}

            <section className="detail-section">
              <h3>Round scores</h3>
              <div className="round-grid">
                {row.windowCompositeScores.map((round) => (
                  <div key={round.roundIndex} className="round-chip">
                    <span>R{round.roundIndex}</span>
                    <strong>{formatScore(round.compositeScore)}</strong>
                    <small>{round.state}</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h3>Raw leaderboard row</h3>
              <pre className="json-block">{JSON.stringify(row, null, 2)}</pre>
            </section>

            {detail && (
              <section className="detail-section">
                <h3>Raw miner API response</h3>
                <pre className="json-block">{JSON.stringify(detail, null, 2)}</pre>
              </section>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
