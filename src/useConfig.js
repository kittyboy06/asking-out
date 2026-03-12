import { useState, useEffect } from 'react'

const DEFAULT_CONFIG = {
  senderName: 'Afsal',
  inviteEmoji: '⚡️',
  inviteTitle: 'Are You Free?? 🙌',
  inviteSubtitle: "is asking if you're around today!",
  heroImageUrl: '',
  heroImageAlt: 'Casual fun vibe illustration',
  acceptButtonText: 'Sure!! 🎉',
  declineButtonText: 'Maybe later',
  detailsLabel: 'Chill Invite',
  detailsTitle: 'Are you free?? ☕️✨',
  venueImageUrl: '',
  venueImageAlt: 'Venue photo',
  venueName: 'The Daily Grind',
  venueAddress: '123 Espresso Lane',
  venueIcon: 'coffee',
  eventDate: 'Today',
  eventTime: '2:00 PM – 3:00 PM',
  detailsAcceptText: "Let's meet! ☕",
  detailsDeclineText: 'Maybe later',
  celebrationEmoji: '🎉',
  celebrationTitle: "It's a date!",
  celebrationMessage: 'See you at The Daily Grind today at 2 PM ☕',
}

export { DEFAULT_CONFIG }

export function useConfig() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}config.json`)
      .then((res) => {
        if (!res.ok) throw new Error('No config file')
        return res.json()
      })
      .then((data) => {
        setConfig({ ...DEFAULT_CONFIG, ...data })
      })
      .catch(() => {
        // Fall back to defaults if config.json doesn't exist
        setConfig(DEFAULT_CONFIG)
      })
      .finally(() => setLoading(false))
  }, [])

  return { config, loading }
}
