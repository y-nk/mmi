import * as stylex from '@stylexjs/stylex'
import { useCallback, useState } from 'react'
import { PRESENCE_LABELS, type Contact, type Presence } from '../../api'
import { colors } from '../../theme/tokens.stylex'
import { BuddyIcon, ChevronCircle, MessengerLogo } from '../icons'
import { Menu } from '../xp/Menu'

const CHOICES: Presence[] = ['online', 'busy', 'brb', 'away', 'phone', 'lunch', 'offline']

interface Props {
  me?: Contact
  onSetPresence: (presence: Presence) => void
}

export function StatusHeader({ me, onSetPresence }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <div {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.logo)}>
        <MessengerLogo />
      </div>
      <div {...stylex.props(styles.text)}>
        <div {...stylex.props(styles.caption)}>My Status:</div>
        <div {...stylex.props(styles.anchor)}>
          <button type="button" {...stylex.props(styles.picker)} onClick={() => setMenuOpen((o) => !o)}>
            <ChevronCircle open={false} />
            <span {...stylex.props(styles.name)}>
              {me ? `${me.name} (${PRESENCE_LABELS[me.presence]})` : 'Signing in...'}
            </span>
          </button>
          {menuOpen && (
            <Menu
              onClose={closeMenu}
              items={CHOICES.map((presence) => ({
                label: presence === 'offline' ? 'Appear Offline' : PRESENCE_LABELS[presence],
                icon: <BuddyIcon presence={presence} />,
                onSelect: () => onSetPresence(presence),
              }))}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    height: 52,
    paddingRight: 6,
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    width: 46,
    flexShrink: 0,
  },
  text: {
    minWidth: 0,
    paddingTop: 4,
  },
  caption: {
    marginLeft: 2,
    marginBottom: 3,
    color: colors.muted,
    fontSize: 12,
  },
  anchor: {
    position: 'relative',
  },
  picker: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    padding: '0 2px',
    borderWidth: 0,
    backgroundColor: 'transparent',
    font: 'inherit',
    fontSize: 12,
    color: colors.text,
    cursor: 'pointer',
    textDecoration: { default: null, ':hover': 'underline' },
  },
  name: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
})
