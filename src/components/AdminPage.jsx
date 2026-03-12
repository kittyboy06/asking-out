import { useState, useEffect } from 'react'
import { DEFAULT_CONFIG } from '../useConfig'
import '../AdminPage.css'

const FIELD_META = [
  { section: '👋 Invite Screen', fields: [
    { key: 'senderName', label: 'Your Name', type: 'text' },
    { key: 'inviteEmoji', label: 'Bouncing Emoji', type: 'text' },
    { key: 'inviteTitle', label: 'Title', type: 'text' },
    { key: 'inviteSubtitle', label: 'Subtitle (after your name)', type: 'text' },
    { key: 'heroImageUrl', label: 'Hero Image URL', type: 'url' },
    { key: 'heroImageAlt', label: 'Hero Image Alt Text', type: 'text' },
    { key: 'acceptButtonText', label: 'Accept Button Text', type: 'text' },
    { key: 'declineButtonText', label: 'Decline Button Text', type: 'text' },
  ]},
  { section: '📍 Details Screen', fields: [
    { key: 'detailsLabel', label: 'Top Label', type: 'text' },
    { key: 'detailsTitle', label: 'Details Title', type: 'text' },
    { key: 'venueImageUrl', label: 'Venue Photo URL', type: 'url' },
    { key: 'venueImageAlt', label: 'Venue Photo Alt Text', type: 'text' },
    { key: 'venueName', label: 'Venue Name', type: 'text' },
    { key: 'venueAddress', label: 'Venue Address', type: 'text' },
    { key: 'venueIcon', label: 'Venue Icon (Material Symbol)', type: 'text' },
    { key: 'eventDate', label: 'Event Date', type: 'text' },
    { key: 'eventTime', label: 'Event Time', type: 'text' },
    { key: 'detailsAcceptText', label: 'Accept Button Text', type: 'text' },
    { key: 'detailsDeclineText', label: 'Decline Button Text', type: 'text' },
  ]},
  { section: '🎉 Celebration Screen', fields: [
    { key: 'celebrationEmoji', label: 'Celebration Emoji', type: 'text' },
    { key: 'celebrationTitle', label: 'Celebration Title', type: 'text' },
    { key: 'celebrationMessage', label: 'Celebration Message', type: 'text' },
  ]},
]

export default function AdminPage() {
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG })
  const [saved, setSaved] = useState(false)
  const [previewScreen, setPreviewScreen] = useState(0)

  // Load existing config on mount
  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setConfig({ ...DEFAULT_CONFIG, ...data }))
      .catch(() => {})
  }, [])

  const updateField = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'config.json'
    a.click()
    URL.revokeObjectURL(url)
    setSaved(true)
  }

  const importConfig = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          setConfig({ ...DEFAULT_CONFIG, ...data })
          setSaved(false)
        } catch {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const resetDefaults = () => {
    if (confirm('Reset all fields to defaults?')) {
      setConfig({ ...DEFAULT_CONFIG })
      setSaved(false)
    }
  }

  return (
    <div className="admin-layout">
      {/* ── Sidebar Form ── */}
      <div className="admin-sidebar">
        <div className="admin-header">
          <div className="admin-header-top">
            <h1 className="admin-logo">⚙️ Admin</h1>
            <a href="#/" className="admin-back-link">← Back to Invite</a>
          </div>
          <p className="admin-tagline">Edit everything. Export config. Done.</p>
        </div>

        <div className="admin-form">
          {FIELD_META.map(({ section, fields }) => (
            <div key={section} className="admin-section">
              <h2 className="admin-section-title">{section}</h2>
              {fields.map(({ key, label, type }) => (
                <div key={key} className="admin-field">
                  <label htmlFor={`field-${key}`}>{label}</label>
                  {type === 'url' ? (
                    <>
                      <input
                        id={`field-${key}`}
                        type="url"
                        value={config[key]}
                        onChange={(e) => updateField(key, e.target.value)}
                        placeholder="https://..."
                      />
                      {config[key] && (
                        <img
                          src={config[key]}
                          alt="Preview"
                          className="admin-image-preview"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      )}
                    </>
                  ) : (
                    <input
                      id={`field-${key}`}
                      type="text"
                      value={config[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="admin-actions">
          <button className="admin-btn admin-btn--export" onClick={exportConfig}>
            📥 Export config.json
          </button>
          <button className="admin-btn admin-btn--import" onClick={importConfig}>
            📤 Import config.json
          </button>
          <button className="admin-btn admin-btn--reset" onClick={resetDefaults}>
            🔄 Reset to Defaults
          </button>
          {saved && <span className="admin-saved-badge">✅ Exported!</span>}
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div className="admin-preview">
        <div className="admin-preview-header">
          <h2>Live Preview</h2>
          <div className="admin-preview-tabs">
            <button
              className={`preview-tab ${previewScreen === 0 ? 'preview-tab--active' : ''}`}
              onClick={() => setPreviewScreen(0)}
            >Invite</button>
            <button
              className={`preview-tab ${previewScreen === 1 ? 'preview-tab--active' : ''}`}
              onClick={() => setPreviewScreen(1)}
            >Details</button>
            <button
              className={`preview-tab ${previewScreen === 2 ? 'preview-tab--active' : ''}`}
              onClick={() => setPreviewScreen(2)}
            >Celebration</button>
          </div>
        </div>

        <div className="admin-preview-phone">
          <div className="phone-frame">
            <div className="status-bar" />
            <div className="progress-dots">
              <div className={`progress-dot ${previewScreen >= 0 ? 'progress-dot--active' : 'progress-dot--inactive'}`} />
              <div className={`progress-dot ${previewScreen >= 1 ? 'progress-dot--active' : 'progress-dot--inactive'}`} />
            </div>

            {previewScreen === 0 && (
              <>
                <div className="screen-invite">
                  <div className="emoji-bounce">{config.inviteEmoji}</div>
                  <h1 className="invite-title">{config.inviteTitle}</h1>
                  <p className="invite-subtitle">
                    <strong>{config.senderName}</strong> {config.inviteSubtitle}
                  </p>
                  {config.heroImageUrl && (
                    <div className="hero-image-container">
                      <div className="hero-glow" />
                      <img
                        className="hero-image"
                        src={config.heroImageUrl}
                        alt={config.heroImageAlt}
                      />
                    </div>
                  )}
                </div>
                <div className="action-buttons">
                  <button className="btn-maybe">{config.declineButtonText}</button>
                  <button className="btn-letsgo">{config.acceptButtonText}</button>
                </div>
              </>
            )}

            {previewScreen === 1 && (
              <>
                <div className="screen-details">
                  <p className="details-label">{config.detailsLabel}</p>
                  <h1 className="details-title">{config.detailsTitle}</h1>
                  {config.venueImageUrl && (
                    <div className="details-photo-container">
                      <div className="details-photo-wrapper">
                        <img
                          className="details-photo"
                          src={config.venueImageUrl}
                          alt={config.venueImageAlt}
                        />
                      </div>
                    </div>
                  )}
                  <div className="event-card">
                    <div className="event-card-content">
                      <div className="event-row">
                        <div className="event-icon">
                          <span className="material-symbols-outlined">{config.venueIcon}</span>
                        </div>
                        <div className="event-info">
                          <h3>{config.venueName}</h3>
                          <p>{config.venueAddress}</p>
                        </div>
                      </div>
                      <div className="event-divider" />
                      <div className="event-row">
                        <div className="event-icon">
                          <span className="material-symbols-outlined">calendar_today</span>
                        </div>
                        <div className="event-info">
                          <h3>{config.eventDate}</h3>
                          <p>{config.eventTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="btn-maybe">{config.detailsDeclineText}</button>
                  <button className="btn-letsgo">{config.detailsAcceptText}</button>
                </div>
              </>
            )}

            {previewScreen === 2 && (
              <div className="screen-celebration">
                <div className="celebration-emoji">{config.celebrationEmoji}</div>
                <h1 className="celebration-title">{config.celebrationTitle}</h1>
                <p className="celebration-sub">{config.celebrationMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
