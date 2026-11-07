import { useEffect, useMemo, useState } from 'react'
import { reviewsAPI } from './services/api'
import './App.css'

const demoReviews = [
  {
    id: 1,
    prNumber: 42,
    prTitle: 'Fix authentication bug in login flow',
    repositoryOwner: 'northstar',
    repositoryName: 'backend',
    status: 'COMPLETED',
    qualityScore: 8.5,
    issues: [
      { severity: 'HIGH', type: 'SECURITY', title: 'Session token persists after logout', filePath: 'AuthService.java', lineNumber: 84 },
      { severity: 'MEDIUM', type: 'BUG', title: 'Missing null guard on callback', filePath: 'LoginController.java', lineNumber: 31 },
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    prUrl: 'https://github.com/northstar/backend/pull/42',
  },
  {
    id: 2,
    prNumber: 38,
    prTitle: 'Add user profile management feature',
    repositoryOwner: 'northstar',
    repositoryName: 'frontend',
    status: 'COMPLETED',
    qualityScore: 9.2,
    issues: [{ severity: 'LOW', type: 'CODE_QUALITY', title: 'Extract repeated formatter', filePath: 'Profile.jsx', lineNumber: 46 }],
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    prUrl: 'https://github.com/northstar/frontend/pull/38',
  },
  {
    id: 3,
    prNumber: 35,
    prTitle: 'Optimize database queries for analytics',
    repositoryOwner: 'northstar',
    repositoryName: 'backend',
    status: 'COMPLETED',
    qualityScore: 7.8,
    issues: [
      { severity: 'CRITICAL', type: 'PERFORMANCE', title: 'Unbounded analytics query', filePath: 'AnalyticsRepository.java', lineNumber: 117 },
      { severity: 'HIGH', type: 'PERFORMANCE', title: 'Missing composite index', filePath: 'ReviewRepository.java', lineNumber: 29 },
      { severity: 'MEDIUM', type: 'CODE_QUALITY', title: 'Query result mapped twice', filePath: 'AnalyticsService.java', lineNumber: 72 },
    ],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    prUrl: 'https://github.com/northstar/backend/pull/35',
  },
  {
    id: 4,
    prNumber: 31,
    prTitle: 'Implement real-time notifications',
    repositoryOwner: 'northstar',
    repositoryName: 'backend',
    status: 'PENDING',
    qualityScore: null,
    issues: [],
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    prUrl: 'https://github.com/northstar/backend/pull/31',
  },
  {
    id: 5,
    prNumber: 28,
    prTitle: 'Update dependencies and fix vulnerabilities',
    repositoryOwner: 'northstar',
    repositoryName: 'platform',
    status: 'FAILED',
    qualityScore: 6.4,
    issues: [
      { severity: 'CRITICAL', type: 'SECURITY', title: 'Known vulnerable dependency', filePath: 'pom.xml', lineNumber: 64 },
      { severity: 'HIGH', type: 'SECURITY', title: 'Overly broad CORS configuration', filePath: 'SecurityConfig.java', lineNumber: 22 },
    ],
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    prUrl: 'https://github.com/northstar/platform/pull/28',
  },
]

const navItems = [
  ['grid', 'Dashboard', 'dashboard'],
  ['list', 'Pull requests', 'review-queue'],
  ['repo', 'Repositories', 'review-queue'],
  ['shield', 'Security', 'security-center'],
  ['chart', 'Insights', 'engineering-insights'],
]

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
    repo: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    chart: <><path d="M3 3v18h18" /><path d="m7 16 4-5 4 3 5-7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.08V21h-4v-.08A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.08-.4H3v-4h.08A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.08V3h4v.08A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.36.29.57.7.6 1.15V10h1v4h-.08A1.7 1.7 0 0 0 19.4 15Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    refresh: <><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" /></>,
    external: <><path d="M15 3h6v6M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
    close: <><path d="M18 6 6 18M6 6l12 12" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  }

  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Logo() {
  return <div className="brand-mark" aria-hidden="true">PR</div>
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Unknown'
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp)) / 1000))
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function Status({ value }) {
  const labels = { COMPLETED: 'Reviewed', PENDING: 'In review', FAILED: 'Needs changes' }
  return <span className={`status status-${value?.toLowerCase()}`}>{labels[value] || value}</span>
}

function Score({ value }) {
  if (value == null) return <span className="score-pending">--</span>
  return <span className={`score score-${value >= 9 ? 'great' : value >= 7 ? 'good' : 'risk'}`}>{value.toFixed(1)}</span>
}

function Metric({ label, value, note, tone = 'positive', children }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-main"><strong>{value}</strong>{children}</div>
      <div className={`metric-note ${tone}`}>{note}</div>
    </div>
  )
}

function App() {
  const [stats, setStats] = useState({ totalReviews: 0, activePRs: 0, avgQualityScore: 0, issuesFound: 0, criticalIssues: 0, highIssues: 0, mediumIssues: 0, lowIssues: 0 })
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedReview, setSelectedReview] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [statsData, reviewsData] = await Promise.all([reviewsAPI.getStats(), reviewsAPI.getRecent()])
      setStats(statsData)
      setReviews(reviewsData || [])
      setUsingDemo(false)
    } catch {
      setStats({ totalReviews: 247, activePRs: 12, avgQualityScore: 8.4, issuesFound: 89, criticalIssues: 4, highIssues: 17, mediumIssues: 41, lowIssues: 27 })
      setReviews(demoReviews)
      setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredReviews = useMemo(() => reviews.filter((review) => {
    const haystack = `${review.prTitle} ${review.repositoryOwner}/${review.repositoryName} ${review.prNumber}`.toLowerCase()
    return haystack.includes(search.toLowerCase()) && (statusFilter === 'ALL' || review.status === statusFilter)
  }), [reviews, search, statusFilter])

  const severity = {
    critical: stats.criticalIssues || reviews.flatMap((review) => review.issues || []).filter((issue) => issue.severity === 'CRITICAL').length,
    high: stats.highIssues || reviews.flatMap((review) => review.issues || []).filter((issue) => issue.severity === 'HIGH').length,
    medium: stats.mediumIssues || reviews.flatMap((review) => review.issues || []).filter((issue) => issue.severity === 'MEDIUM').length,
    low: stats.lowIssues || reviews.flatMap((review) => review.issues || []).filter((issue) => issue.severity === 'LOW').length,
  }
  const severityTotal = Object.values(severity).reduce((sum, value) => sum + value, 0) || stats.issuesFound || 0
  const recentOutcomes = [
    { label: 'Reviewed', status: 'COMPLETED', tone: 'reviewed' },
    { label: 'In review', status: 'PENDING', tone: 'pending' },
    { label: 'Needs changes', status: 'FAILED', tone: 'failed' },
  ].map((outcome) => ({
    ...outcome,
    count: reviews.filter((review) => review.status === outcome.status).length,
  }))
  const reviewedCount = recentOutcomes[0].count
  const completedRate = reviews.length ? Math.round((reviewedCount / reviews.length) * 100) : 0

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand"><Logo /><span>AI PR Review</span></div>
        <nav className="sidebar-nav">
          {navItems.map(([icon, label, target], index) => (
            <button key={label} className={`nav-item ${index === 0 ? 'active' : ''}`} onClick={() => { document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }); setSidebarOpen(false) }}>
              <Icon name={icon} /><span>{label}</span>{index === 1 && <small>{stats.activePRs || 0}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="org-avatar">EP</div>
          <div><span>Workspace</span><strong>Engineering Platform</strong></div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setSidebarOpen((value) => !value)} aria-label="Toggle menu"><Icon name="menu" /></button>
          <div className="top-search"><Icon name="search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reviews" /><kbd>/</kbd></div>
          <button className="open-pr" onClick={() => document.getElementById('review-queue')?.scrollIntoView({ behavior: 'smooth' })}>View pull requests <span>↗</span></button>
          <button className={`icon-button ${loading ? 'spinning' : ''}`} onClick={fetchDashboardData} aria-label="Refresh dashboard"><Icon name="refresh" /></button>
          <div className="user-avatar">AD</div>
        </header>

        <div className="content">
          <section className="page-intro" id="dashboard">
            <div>
              <span className="eyebrow">ENGINEERING WORKSPACE / OVERVIEW</span>
              <h1>Pull request overview</h1>
              <p>Review quality, open work, and findings across connected repositories.</p>
            </div>
            <div className={`connection ${usingDemo ? 'demo' : ''}`}><span />{usingDemo ? 'Demo data' : 'Live workspace'}</div>
          </section>

          <section className="metrics-grid" aria-label="Dashboard metrics">
            <Metric label="Average quality score" value={stats.avgQualityScore.toFixed(1)} note="Across reviewed pull requests"><span className="metric-unit">/ 10</span></Metric>
            <Metric label="Reviews completed" value={stats.totalReviews} note="All recorded reviews" />
            <Metric label="Open pull requests" value={stats.activePRs} note="Currently in review" tone="warning" />
            <Metric label="Findings recorded" value={stats.issuesFound} note={`${severity.critical} critical`} tone={severity.critical ? 'danger' : 'positive'} />
          </section>

          <section className="insights-grid">
            <article className="panel outcomes-panel" id="engineering-insights">
              <div className="panel-head"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Review outcomes</h2><p>Pull requests received in the last seven days</p></div><span className="panel-meta">{reviews.length} reviews</span></div>
              <div className="outcomes-summary"><strong>{completedRate}%</strong><span>reviewed in this period</span></div>
              <div className="outcomes-list">
                {recentOutcomes.map(({ label, count, tone }) => (
                  <div className="outcome-row" key={label}>
                    <span className={`outcome-marker ${tone}`} />
                    <span>{label}</span>
                    <div className="outcome-track"><i className={tone} style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} /></div>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel severity-panel" id="security-center">
              <div className="panel-head"><div><span className="eyebrow">RISK DISTRIBUTION</span><h2>Findings by severity</h2><p>Recorded across all reviews</p></div></div>
              <div className="severity-content">
                <div className="donut" style={{ '--critical': `${severityTotal ? (severity.critical / severityTotal) * 100 : 0}%`, '--high': `${severityTotal ? ((severity.critical + severity.high) / severityTotal) * 100 : 0}%`, '--medium': `${severityTotal ? ((severity.critical + severity.high + severity.medium) / severityTotal) * 100 : 0}%` }}><div><strong>{severityTotal}</strong><span>issues</span></div></div>
                <div className="severity-list">
                  {Object.entries(severity).map(([label, value]) => <div key={label}><span className={`severity-key ${label}`} /> <span>{label}</span><strong>{value}</strong></div>)}
                </div>
              </div>
            </article>
          </section>

          <section className="queue-section" id="review-queue">
            <div className="queue-head">
              <div><span className="eyebrow">WORK QUEUE</span><h2>Pull requests <span>{filteredReviews.length}</span></h2><p>Recent reviews and their findings</p></div>
              <div className="queue-tools">
                <div className="queue-search"><Icon name="search" size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search queue" /></div>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option value="ALL">All statuses</option><option value="COMPLETED">Reviewed</option><option value="PENDING">In review</option><option value="FAILED">Needs changes</option></select>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Repository</th><th>Pull request</th><th>Status</th><th>Findings</th><th>Quality</th><th>Received</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review.id} onClick={() => setSelectedReview(review)}>
                      <td><code>{review.repositoryOwner}/{review.repositoryName}</code></td>
                      <td><strong>#{review.prNumber} {review.prTitle}</strong><span>{review.prAuthor || 'Author unavailable'}</span></td>
                      <td><Status value={review.status} /></td>
                      <td><span className="issue-count">{review.issues?.length || 0}</span></td>
                      <td><Score value={review.qualityScore} /></td>
                      <td className="muted">{formatTimeAgo(review.createdAt)}</td>
                      <td><button className="row-action" onClick={(event) => { event.stopPropagation(); setSelectedReview(review) }}>View <span>›</span></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredReviews.length && <div className="empty-state">No reviews match your search.</div>}
            </div>
          </section>
        </div>

        <footer className="health-strip">
          <div className="health-title"><span className="health-dot" /> Review service</div>
          <span className="health-note">Data refreshes every 30 seconds</span>
          <button onClick={fetchDashboardData}><Icon name="refresh" size={15} /> {loading ? 'Refreshing' : 'Refresh data'}</button>
        </footer>
      </main>

      {selectedReview && (
        <div className="drawer-backdrop" onClick={() => setSelectedReview(null)}>
          <aside className="review-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head"><div><code>{selectedReview.repositoryOwner}/{selectedReview.repositoryName}</code><h2>#{selectedReview.prNumber} {selectedReview.prTitle}</h2></div><button className="icon-button" onClick={() => setSelectedReview(null)} aria-label="Close details"><Icon name="close" /></button></div>
            <div className="drawer-summary"><div><span>Status</span><Status value={selectedReview.status} /></div><div><span>Quality score</span><Score value={selectedReview.qualityScore} /></div><div><span>Findings</span><strong>{selectedReview.issues?.length || 0}</strong></div></div>
            <div className="drawer-timeline"><h3>Review timeline</h3><p><i /> Submitted {formatTimeAgo(selectedReview.createdAt)}</p>{selectedReview.updatedAt && <p><i /> Last updated {formatTimeAgo(selectedReview.updatedAt)}</p>}</div>
            {selectedReview.analysisSummary && <div className="drawer-section review-summary"><h3>Review summary</h3><p>{selectedReview.analysisSummary}</p></div>}
            <div className="drawer-section"><h3>Review findings</h3>{selectedReview.issues?.length ? selectedReview.issues.map((issue, index) => <div className="finding" key={`${issue.title}-${index}`}><div className={`finding-severity ${issue.severity?.toLowerCase()}`}>{issue.severity}</div><strong>{issue.title}</strong><code>{issue.filePath}{issue.lineNumber ? `:${issue.lineNumber}` : ''}</code>{issue.description && <p>{issue.description}</p>}{issue.suggestion && <div className="finding-suggestion"><span>Suggested improvement</span><p>{issue.suggestion}</p></div>}</div>) : <p className="drawer-empty">No findings were recorded for this review.</p>}</div>
            {selectedReview.prUrl && <a className="drawer-link" href={selectedReview.prUrl} target="_blank" rel="noreferrer">Open pull request <Icon name="external" size={16} /></a>}
          </aside>
        </div>
      )}
    </div>
  )
}

export default App
