import type { Presence } from '../api'

const BUDDY_COLORS = {
  green: { head: '#5cc23a', body: '#2b8fd0' },
  blue: { head: '#4a9be6', body: '#2366c4' },
  red: { head: '#e8613c', body: '#b8322a' },
}

function Buddy({ color, x = 0 }: { color: keyof typeof BUDDY_COLORS; x?: number }) {
  const { head, body } = BUDDY_COLORS[color]
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M2.6 15.6C2.6 11 4.8 9.1 8 9.1s5.4 1.9 5.4 6.5Z" fill={body} stroke="#0d3a6e" strokeWidth=".5" />
      <ellipse cx="6.6" cy="11.2" rx="2" ry="1" fill="#fff" opacity=".45" />
      <circle cx="8" cy="5" r="3.5" fill={head} stroke="#1d5a16" strokeWidth=".5" />
      <ellipse cx="6.9" cy="3.6" rx="1.5" ry="1" fill="#fff" opacity=".6" />
    </g>
  )
}

/** The classic buddy, with MSN's status badge in the bottom-left corner. */
export function BuddyIcon({ presence, size = 16 }: { presence: Presence; size?: number }) {
  const badge =
    presence === 'busy' || presence === 'phone'
      ? 'busy'
      : presence === 'away' || presence === 'brb' || presence === 'lunch'
        ? 'away'
        : undefined
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <Buddy color={presence === 'offline' ? 'red' : 'green'} />
      {badge === 'busy' && (
        <g>
          <circle cx="4.5" cy="11.5" r="4" fill="#d62a1e" stroke="#fff" strokeWidth=".8" />
          <rect x="2.3" y="10.7" width="4.4" height="1.6" fill="#fff" />
        </g>
      )}
      {badge === 'away' && (
        <g>
          <circle cx="4.5" cy="11.5" r="4" fill="#fffbe0" stroke="#7a6a2a" strokeWidth=".8" />
          <path d="M4.5 9v2.5h2" fill="none" stroke="#333" strokeWidth=".9" />
        </g>
      )}
    </svg>
  )
}

/** Two overlapping buddies — the Messenger logo. */
export function MessengerLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 18" aria-hidden>
      <Buddy color="blue" x={5.5} />
      <Buddy color="green" />
    </svg>
  )
}

export function EnvelopeIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
      <rect x=".5" y=".5" width="15" height="11" fill="#fff" stroke="#6b7b94" />
      <path d="M.5.5 8 7l7.5-6.5" fill="none" stroke="#6b7b94" />
    </svg>
  )
}

/** Round expand/collapse button used on group headers and panes. */
export function ChevronCircle({ open, double = false }: { open: boolean; double?: boolean }) {
  const chevron = open ? 'M5 9.5 8 6.5l3 3' : 'M5 6.5 8 9.5l3-3'
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="7.2" fill="#fff" stroke="#7d9fd8" />
      <g fill="none" stroke="#2d5bb5" strokeWidth="1.6">
        <path d={chevron} transform={double ? 'translate(0 -2)' : undefined} />
        {double && <path d={chevron} transform="translate(0 2)" />}
      </g>
    </svg>
  )
}

export function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path d="M7 1.5v11M1.5 7h11" stroke="#1f9e2f" strokeWidth="3" />
    </svg>
  )
}
