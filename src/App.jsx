import { useState, useEffect } from 'react'
import Confetti from './components/Confetti'
import AdminPage from './components/AdminPage'
import { useConfig } from './useConfig'

function InviteApp({ config }) {
  const [screen, setScreen] = useState(0)

  return (
    <div className="app">
      <div className="blob-pink" />
      <div className="blob-blue" />

      <div className="phone-frame">
        <div className="status-bar" />

        <div className="progress-dots">
          <div className={`progress-dot ${screen >= 0 ? 'progress-dot--active' : 'progress-dot--inactive'}`} />
          <div className={`progress-dot ${screen >= 1 ? 'progress-dot--active' : 'progress-dot--inactive'}`} />
        </div>

        {/* ─── Screen 0: Invite ─── */}
        {screen === 0 && (
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
              <button className="btn-maybe" onClick={() => {}}>
                {config.declineButtonText}
              </button>
              <button className="btn-letsgo" onClick={() => setScreen(1)}>
                {config.acceptButtonText}
              </button>
            </div>
          </>
        )}

        {/* ─── Screen 1: Details ─── */}
        {screen === 1 && (
          <>
            <div className="screen-details">
              <button className="back-button" onClick={() => setScreen(0)}>
                <span className="material-symbols-outlined">arrow_back</span>
              </button>

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
              <button className="btn-maybe" onClick={() => setScreen(0)}>
                {config.detailsDeclineText}
              </button>
              <button className="btn-letsgo" onClick={() => setScreen(2)}>
                {config.detailsAcceptText}
              </button>
            </div>
          </>
        )}

        {/* ─── Screen 2: Celebration ─── */}
        {screen === 2 && (
          <>
            <Confetti />
            <div className="screen-celebration">
              <div className="celebration-emoji">{config.celebrationEmoji}</div>
              <h1 className="celebration-title">{config.celebrationTitle}</h1>
              <p className="celebration-sub">{config.celebrationMessage}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash)
  const { config, loading } = useConfig()

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (loading) return null

  if (route === '#/admin') {
    return <AdminPage />
  }

  return <InviteApp config={config} />
}
