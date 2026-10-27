
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:5000/api'

type User = {
  id: number
  name: string
  email: string
}

type Item = {
  id: number
  creator_id: number
  item_name: string
  report_type: 'Lost' | 'Found'
  category: string
  description: string
  location: string
  incident_date: string
  status: 'Open' | 'Resolved'
  created_at: string | null
}

type AuthResponse = {
  message?: string
  error?: string
  access_token?: string
  user?: User
}

type ItemsResponse = {
  items?: Item[]
  count?: number
  error?: string
}

const CATEGORIES = [
  'Electronics',
  'Books & Stationery',
  'ID Cards',
  'Accessories',
  'Clothing',
  'Bags',
  'Keys',
  'Documents',
  'Other',
]

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string
    message?: string
  }

  if (!response.ok) {
    throw new Error(
      data.error || data.message || `Request failed (${response.status})`,
    )
  }

  return data
}

function formatDate(date: string) {
  if (!date) return 'Date not provided'

  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
    'en-IN',
    { day: 'numeric', month: 'short', year: 'numeric' },
  )
}

function App() {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('campus_token'),
  )
  const [user, setUser] = useState<User | null>(null)

  const [items, setItems] = useState<Item[]>([])
  const [myItems, setMyItems] = useState<Item[]>([])
  const [activeTab, setActiveTab] = useState<'browse' | 'report' | 'mine'>(
    'browse',
  )
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [reportForm, setReportForm] = useState({
    item_name: '',
    report_type: 'Lost',
    category: 'Electronics',
    description: '',
    location: '',
    incident_date: new Date().toISOString().slice(0, 10),
  })

  const [keyword, setKeyword] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const [loading, setLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const loadItems = useCallback(async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (keyword.trim()) params.set('q', keyword.trim())
      if (filterType) params.set('type', filterType)
      if (filterCategory) params.set('category', filterCategory)

      const query = params.toString()
      const result = await apiRequest<ItemsResponse>(
        `/items${query ? `?${query}` : ''}`,
      )

      setItems(result.items ?? [])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load reports. Check that the backend is running.',
      )
    } finally {
      setLoading(false)
    }
  }, [keyword, filterType, filterCategory])

  const loadMyItems = useCallback(
    async (currentToken: string) => {
      try {
        const result = await apiRequest<ItemsResponse>(
          '/items/mine',
          {},
          currentToken,
        )
        setMyItems(result.items ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load your reports.')
      }
    },
    [],
  )

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      if (!token) {
        setUser(null)
        setMyItems([])
        return
      }

      try {
        const result = await apiRequest<{ user: User }>(
          '/auth/me',
          {},
          token,
        )

        if (!cancelled) {
          setUser(result.user)
          await loadMyItems(token)
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem('campus_token')
          setToken(null)
          setUser(null)
          setMyItems([])
        }
      }
    }

    void restoreSession()

    return () => {
      cancelled = true
    }
  }, [token, loadMyItems])

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')
    setAuthLoading(true)

    try {
      if (authMode === 'register') {
        await apiRequest<AuthResponse>('/auth/register', {
          method: 'POST',
          body: JSON.stringify(authForm),
        })

        setNotice('Account created successfully. You can now sign in.')
        setAuthMode('login')
        setAuthForm((previous) => ({ ...previous, password: '' }))
      } else {
        const result = await apiRequest<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: authForm.email,
            password: authForm.password,
          }),
        })

        if (!result.access_token || !result.user) {
          throw new Error('The server did not return a valid login response.')
        }

        localStorage.setItem('campus_token', result.access_token)
        setToken(result.access_token)
        setUser(result.user)
        setAuthForm({ name: '', email: '', password: '' })
        setNotice(`Welcome back, ${result.user.name}!`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setAuthLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('campus_token')
    setToken(null)
    setUser(null)
    setMyItems([])
    setActiveTab('browse')
    setSelectedItem(null)
    setNotice('You have been signed out.')
    setError('')
  }

  async function handleReportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) {
      setError('Please sign in before submitting a report.')
      return
    }

    setError('')
    setNotice('')
    setLoading(true)

    try {
      const result = await apiRequest<{ message: string; item: Item }>(
        '/items',
        {
          method: 'POST',
          body: JSON.stringify(reportForm),
        },
        token,
      )

      setNotice(result.message || 'Your report has been submitted.')
      setReportForm({
        item_name: '',
        report_type: 'Lost',
        category: 'Electronics',
        description: '',
        location: '',
        incident_date: new Date().toISOString().slice(0, 10),
      })
      setActiveTab('browse')
      setSelectedItem(null)
      await loadItems()
      await loadMyItems(token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit report.')
    } finally {
      setLoading(false)
    }
  }

  async function resolveItem(item: Item) {
    if (!token) return

    const confirmed = window.confirm(
      `Mark "${item.item_name}" as resolved?`,
    )
    if (!confirmed) return

    setError('')
    setNotice('')

    try {
      const result = await apiRequest<{ message: string; item: Item }>(
        `/items/${item.id}/resolve`,
        { method: 'PATCH' },
        token,
      )

      setNotice(result.message || 'Report marked as resolved.')
      setSelectedItem((current) =>
        current?.id === item.id ? result.item : current,
      )
      await loadItems()
      await loadMyItems(token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resolve report.')
    }
  }

  async function openItem(item: Item) {
    setError('')
    setSelectedItem(item)

    try {
      const result = await apiRequest<{ item: Item }>(`/items/${item.id}`)
      setSelectedItem(result.item)
    } catch {
      // Keep the list's existing item data available if detail loading fails.
    }
  }

  const visibleItems = items
  const openCount = items.filter((item) => item.status === 'Open').length
  const resolvedCount = items.filter((item) => item.status === 'Resolved').length

  return (
    <div className="app-shell">
      <header className="topbar">
        <a
          className="brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault()
            setActiveTab('browse')
            setSelectedItem(null)
          }}
        >
          <span className="brand-mark" aria-hidden="true">⌕</span>
          <span>
            <strong>Campus<span className="brand-accent">Find</span></strong>
            <small>Lost &amp; Found Portal</small>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <button
            className={activeTab === 'browse' ? 'nav-link active' : 'nav-link'}
            onClick={() => {
              setActiveTab('browse')
              setSelectedItem(null)
            }}
          >
            Browse items
          </button>
          <button
            className={activeTab === 'report' ? 'nav-link active' : 'nav-link'}
            onClick={() => {
              setActiveTab('report')
              setSelectedItem(null)
            }}
          >
            Report an item
          </button>
          {user && (
            <button
              className={activeTab === 'mine' ? 'nav-link active' : 'nav-link'}
              onClick={() => {
                setActiveTab('mine')
                setSelectedItem(null)
                void loadMyItems(token!)
              }}
            >
              My reports
            </button>
          )}
        </nav>

        <div className="account-area">
          {user ? (
            <>
              <div className="user-chip">
                <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
                <span className="user-name">{user.name}</span>
              </div>
              <button className="button button-outline button-small" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <button
              className="button button-dark button-small"
              onClick={() => {
                setActiveTab('report')
                setSelectedItem(null)
                setAuthMode('login')
                setError('')
                setNotice('')
                window.setTimeout(() => {
                  document.getElementById('auth-panel')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  })
                }, 100)
              }}  
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <main id="home">
        {notice && (
          <div className="alert alert-success" role="status">
            <span>✓</span> {notice}
            <button aria-label="Dismiss message" onClick={() => setNotice('')}>×</button>
          </div>
        )}
        {error && (
          <div className="alert alert-error" role="alert">
            <span>!</span> {error}
            <button aria-label="Dismiss error" onClick={() => setError('')}>×</button>
          </div>
        )}

        {activeTab === 'browse' && !selectedItem && (
          <>
            <section className="hero-section">
              <div className="hero-copy">
                <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CAMPUS, CONNECTED</div>
                <h1>Lost something?<br /><span>Let’s find it.</span></h1>
                <p className="hero-description">
                  A little help goes a long way. Report lost belongings,
                  share found items, and help our campus community reconnect
                  with what matters.
                </p>
                <div className="hero-actions">
                  <button
                    className="button button-dark"
                    onClick={() => {
                      setActiveTab('report')
                      setSelectedItem(null)
                    }}
                  >
                    + Report an item
                  </button>
                  <button
                    className="button button-outline"
                    onClick={() => document.getElementById('report-list')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore reports <span aria-hidden="true">↓</span>
                  </button>
                </div>
                <div className="community-note">
                  <div className="mini-avatars" aria-hidden="true">
                    <span>✦</span><span>⌂</span><span>♡</span>
                  </div>
                  <p><strong>Better together.</strong> One campus community looking out for each other.</p>
                </div>
              </div>

              <div className="hero-art" aria-label="Illustration of a lost item being returned">
                <div className="art-sun" />
                <div className="art-orbit orbit-one" />
                <div className="art-orbit orbit-two" />
                <div className="art-spark spark-one">✳</div>
                <div className="art-spark spark-two">✦</div>
                <div className="art-card art-card-back">
                  <span className="art-card-icon">⌕</span>
                  <span className="art-line long" /><span className="art-line short" />
                </div>
                <div className="art-card art-card-front">
                  <span className="art-tag">FOUND IT!</span>
                  <div className="art-bag">▰</div>
                  <span className="art-line long" /><span className="art-line medium" />
                  <span className="art-card-caption">A little thing, a big relief.</span>
                </div>
                <div className="art-floating-label"><span>♡</span> Good things find their way back.</div>
              </div>
            </section>

            <section className="stats-row" aria-label="Report summary">
              <div className="stat-card">
                <span className="stat-icon stat-purple">⌕</span>
                <div><strong>{items.length}</strong><span>Reports matching your view</span></div>
              </div>
              <div className="stat-card">
                <span className="stat-icon stat-green">↗</span>
                <div><strong>{openCount}</strong><span>Still looking / open</span></div>
              </div>
              <div className="stat-card">
                <span className="stat-icon stat-orange">✓</span>
                <div><strong>{resolvedCount}</strong><span>Marked as resolved</span></div>
              </div>
            </section>

            <section className="listing-section" id="report-list">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">THE COMMUNITY BOARD</div>
                  <h2>Recent reports<span className="heading-period">.</span></h2>
                  <p>Every report is a chance to help someone out.</p>
                </div>
                <button
                  className="button button-dark"
                  onClick={() => {
                    setActiveTab('report')
                    setSelectedItem(null)
                  }}
                >
                  + Create report
                </button>
              </div>

              <div className="filter-panel">
                <label className="search-box">
                  <span aria-hidden="true">⌕</span>
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Search item name or description..."
                    aria-label="Search item reports"
                  />
                  {keyword && (
                    <button aria-label="Clear search" onClick={() => setKeyword('')}>×</button>
                  )}
                </label>
                <label className="filter-control">
                  <span>Report type</span>
                  <select value={filterType} onChange={(event) => setFilterType(event.target.value)}>
                    <option value="">All reports</option>
                    <option value="Lost">Lost items</option>
                    <option value="Found">Found items</option>
                  </select>
                </label>
                <label className="filter-control">
                  <span>Category</span>
                  <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}>
                    <option value="">All categories</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <button
                  className="button button-outline clear-filters"
                  onClick={() => {
                    setKeyword('')
                    setFilterType('')
                    setFilterCategory('')
                  }}
                >
                  Reset
                </button>
              </div>

              <div className="results-line">
                <span>{loading ? 'Loading reports…' : `${visibleItems.length} report${visibleItems.length === 1 ? '' : 's'} found`}</span>
                <span className="live-label"><span /> Updated from the campus board</span>
              </div>

              {loading ? (
                <div className="empty-state"><div className="empty-icon">◌</div><h3>Loading reports</h3><p>Please wait while we fetch the latest items.</p></div>
              ) : visibleItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">⌕</div>
                  <h3>No reports found just yet</h3>
                  <p>Try changing your filters, or be the first to add a report.</p>
                  <button className="button button-dark" onClick={() => setActiveTab('report')}>Report an item</button>
                </div>
              ) : (
                <div className="item-grid">
                  {visibleItems.map((item) => (
                    <article className="item-card" key={item.id}>
                      <div className={`item-illustration illustration-${(item.id % 4) + 1}`}>
                        <span className="item-category">{item.category}</span>
                        <span className="item-symbol" aria-hidden="true">
                          {item.category.toLowerCase().includes('book') ? '▤'
                            : item.category.toLowerCase().includes('key') ? '⚿'
                              : item.category.toLowerCase().includes('bag') ? '▱'
                                : item.category.toLowerCase().includes('id') ? '▣'
                                  : item.category.toLowerCase().includes('cloth') ? '◇'
                                    : item.category.toLowerCase().includes('electronic') ? '⌁'
                                      : item.category.toLowerCase().includes('document') ? '▧'
                                        : '✳'}
                        </span>
                        <span className={`status-pill ${item.status === 'Resolved' ? 'status-resolved' : 'status-open'}`}>
                          {item.status === 'Resolved' ? '✓ Resolved' : '● Open'}
                        </span>
                      </div>
                      <div className="item-card-body">
                        <div className="item-type-line">
                          <span className={item.report_type === 'Lost' ? 'type-lost' : 'type-found'}>
                            {item.report_type === 'Lost' ? '↗ LOST ITEM' : '↙ FOUND ITEM'}
                          </span>
                          <span className="item-number">#{item.id.toString().padStart(3, '0')}</span>
                        </div>
                        <h3>{item.item_name}</h3>
                        <p className="item-description">{item.description}</p>
                        <div className="item-meta">
                          <span>⌖ {item.location}</span>
                          <span>◷ {formatDate(item.incident_date)}</span>
                        </div>
                        <button className="text-button" onClick={() => void openItem(item)}>
                          View details <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'report' && (
          <section className="form-page">
            <div className="form-intro">
              <div className="eyebrow">HELP SOMETHING FIND ITS WAY HOME</div>
              <h1>Make a report<span className="heading-period">.</span></h1>
              <p>Share the details you know. Someone in our campus community might have the answer.</p>
              <div className="form-tip"><span>✦</span><p><strong>Good to know</strong><br />Be as specific as you can about the item and where it was last seen or found.</p></div>
            </div>
            <div className="form-card">
              {!user ? (
                <div className="auth-panel" id="auth-panel">
                  <div className="form-card-heading">
                    <span className="form-step">01 / ACCOUNT</span>
                    <h2>{authMode === 'login' ? 'Welcome back' : 'Join the community'}</h2>
                    <p>{authMode === 'login' ? 'Sign in to submit a report and manage your items.' : 'Create an account to report and track your items.'}</p>
                  </div>
                  <form onSubmit={handleAuthSubmit} className="portal-form">
                    {authMode === 'register' && (
                      <label className="field">
                        <span>Full name</span>
                        <input
                          value={authForm.name}
                          onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                          placeholder="Your name"
                          required
                          maxLength={100}
                          autoComplete="name"
                        />
                      </label>
                    )}
                    <label className="field">
                      <span>College email</span>
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                        placeholder="you@college.edu"
                        required
                        maxLength={255}
                        autoComplete="email"
                      />
                    </label>
                    <label className="field">
                      <span>Password</span>
                      <input
                        type="password"
                        value={authForm.password}
                        onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                        placeholder="At least 8 characters"
                        required
                        minLength={8}
                        maxLength={128}
                        autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                      />
                    </label>
                    <button className="button button-dark form-submit" disabled={authLoading} type="submit">
                      {authLoading ? 'Please wait…' : authMode === 'login' ? 'Sign in →' : 'Create account →'}
                    </button>
                  </form>
                  <p className="auth-switch">
                    {authMode === 'login' ? 'New to CampusFind?' : 'Already have an account?'}{' '}
                    <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(''); setNotice('') }}>
                      {authMode === 'login' ? 'Create an account' : 'Sign in'}
                    </button>
                  </p>
                </div>
              ) : (
                <>
                  <div className="form-card-heading">
                    <span className="form-step">01 / ITEM DETAILS</span>
                    <h2>What happened?</h2>
                    <p>Fields marked with * are required.</p>
                  </div>
                  <form className="portal-form" onSubmit={handleReportSubmit}>
                    <label className="field">
                      <span>Report type *</span>
                      <div className="choice-row">
                        <button
                          type="button"
                          className={reportForm.report_type === 'Lost' ? 'choice-card selected lost-choice' : 'choice-card'}
                          onClick={() => setReportForm({ ...reportForm, report_type: 'Lost' })}
                        >
                          <span className="choice-icon">↗</span><span><strong>I lost something</strong><small>Help me find it</small></span>
                          <span className="choice-radio" />
                        </button>
                        <button
                          type="button"
                          className={reportForm.report_type === 'Found' ? 'choice-card selected found-choice' : 'choice-card'}
                          onClick={() => setReportForm({ ...reportForm, report_type: 'Found' })}
                        >
                          <span className="choice-icon">↙</span><span><strong>I found something</strong><small>Help me return it</small></span>
                          <span className="choice-radio" />
                        </button>
                      </div>
                    </label>
                    <label className="field">
                      <span>Item name *</span>
                      <input
                        value={reportForm.item_name}
                        onChange={(event) => setReportForm({ ...reportForm, item_name: event.target.value })}
                        placeholder="e.g. Black water bottle"
                        required
                        maxLength={150}
                      />
                    </label>
                    <label className="field">
                      <span>Category *</span>
                      <select
                        value={reportForm.category}
                        onChange={(event) => setReportForm({ ...reportForm, category: event.target.value })}
                        required
                      >
                        {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                      </select>
                    </label>
                    <label className="field">
                      <span>Description *</span>
                      <textarea
                        value={reportForm.description}
                        onChange={(event) => setReportForm({ ...reportForm, description: event.target.value })}
                        placeholder="Colour, brand, identifying marks, or other helpful details…"
                        rows={4}
                        maxLength={5000}
                        required
                      />
                      <small className="field-hint">{reportForm.description.length}/5000 characters</small>
                    </label>
                    <div className="field-grid">
                      <label className="field">
                        <span>{reportForm.report_type === 'Lost' ? 'Last seen location *' : 'Found at location *'}</span>
                        <input
                          value={reportForm.location}
                          onChange={(event) => setReportForm({ ...reportForm, location: event.target.value })}
                          placeholder="e.g. College library"
                          maxLength={200}
                          required
                        />
                      </label>
                      <label className="field">
                        <span>{reportForm.report_type === 'Lost' ? 'Date lost *' : 'Date found *'}</span>
                        <input
                          type="date"
                          value={reportForm.incident_date}
                          onChange={(event) => setReportForm({ ...reportForm, incident_date: event.target.value })}
                          max={new Date().toISOString().slice(0, 10)}
                          required
                        />
                      </label>
                    </div>
                    <div className="form-actions">
                      <button type="button" className="button button-outline" onClick={() => setActiveTab('browse')}>Cancel</button>
                      <button type="submit" className="button button-dark" disabled={loading}>
                        {loading ? 'Submitting…' : 'Submit report →'}
                      </button>
                    </div>
                    <p className="privacy-note">Your report will be visible on the campus board. Please don’t include passwords or other sensitive personal information.</p>
                  </form>
                </>
              )}
            </div>
          </section>
        )}

        {activeTab === 'mine' && user && (
          <section className="listing-section mine-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">YOUR CONTRIBUTION</div>
                <h2>My reports<span className="heading-period">.</span></h2>
                <p>Keep track of the items you’ve reported.</p>
              </div>
              <button className="button button-dark" onClick={() => setActiveTab('report')}>+ New report</button>
            </div>
            {myItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">▤</div>
                <h3>You haven’t submitted any reports</h3>
                <p>When you report a lost or found item, it will appear here.</p>
                <button className="button button-dark" onClick={() => setActiveTab('report')}>Create your first report</button>
              </div>
            ) : (
              <div className="my-report-list">
                {myItems.map((item) => (
                  <article className="my-report-row" key={item.id}>
                    <div className={`my-report-symbol illustration-${(item.id % 4) + 1}`}>
                      {item.report_type === 'Lost' ? '↗' : '↙'}
                    </div>
                    <div className="my-report-info">
                      <div className="item-type-line">
                        <span className={item.report_type === 'Lost' ? 'type-lost' : 'type-found'}>{item.report_type.toUpperCase()}</span>
                        <span className="item-number">REPORT #{item.id}</span>
                      </div>
                      <h3>{item.item_name}</h3>
                      <p>{item.category} · {item.location} · {formatDate(item.incident_date)}</p>
                    </div>
                    <span className={`status-pill ${item.status === 'Resolved' ? 'status-resolved' : 'status-open'}`}>
                      {item.status === 'Resolved' ? '✓ Resolved' : '● Open'}
                    </span>
                    <div className="my-report-actions">
                      <button className="button button-outline button-small" onClick={() => void openItem(item)}>Details</button>
                      {item.status === 'Open' && (
                        <button className="button button-dark button-small" onClick={() => void resolveItem(item)}>Resolve</button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {selectedItem && (
          <section className="detail-page">
            <button className="back-button" onClick={() => setSelectedItem(null)}>← Back to reports</button>
            <div className="detail-layout">
              <div className={`detail-art illustration-${(selectedItem.id % 4) + 1}`}>
                <span className="detail-art-symbol" aria-hidden="true">✳</span>
                <span className={`status-pill ${selectedItem.status === 'Resolved' ? 'status-resolved' : 'status-open'}`}>
                  {selectedItem.status === 'Resolved' ? '✓ Resolved' : '● Open'}
                </span>
              </div>
              <div className="detail-content">
                <div className="item-type-line">
                  <span className={selectedItem.report_type === 'Lost' ? 'type-lost' : 'type-found'}>
                    {selectedItem.report_type.toUpperCase()} ITEM
                  </span>
                  <span className="item-number">REPORT #{selectedItem.id}</span>
                </div>
                <h1>{selectedItem.item_name}<span className="heading-period">.</span></h1>
                <p className="detail-description">{selectedItem.description}</p>
                <div className="detail-facts">
                  <div><span>Category</span><strong>{selectedItem.category}</strong></div>
                  <div><span>Location</span><strong>⌖ {selectedItem.location}</strong></div>
                  <div><span>{selectedItem.report_type === 'Lost' ? 'Date lost' : 'Date found'}</span><strong>{formatDate(selectedItem.incident_date)}</strong></div>
                  <div><span>Current status</span><strong>{selectedItem.status}</strong></div>
                </div>
                {user && user.id === selectedItem.creator_id && selectedItem.status === 'Open' && (
                  <button className="button button-dark detail-resolve" onClick={() => void resolveItem(selectedItem)}>
                    Mark as resolved ✓
                  </button>
                )}
                {!user && (
                  <div className="detail-callout">Have information about this item? Sign in to help keep the campus board up to date.</div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home" onClick={(event) => { event.preventDefault(); setActiveTab('browse'); setSelectedItem(null) }}>
          <span className="brand-mark" aria-hidden="true">⌕</span>
          <span><strong>Campus<span className="brand-accent">Find</span></strong><small>Lost &amp; Found Portal</small></span>
        </a>
        <p>Small acts of kindness make a big difference.</p>
        <span className="footer-credit">MADE FOR OUR CAMPUS COMMUNITY <span>✦</span></span>
      </footer>
    </div>
  )
}

export default App
