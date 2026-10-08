import * as stylex from '@stylexjs/stylex'
import { useState, type ReactNode } from 'react'
import { PRESENCE_LABELS, type Contact } from '../../api'
import { colors } from '../../theme/tokens.stylex'
import { BuddyIcon, ChevronCircle, EnvelopeIcon } from '../icons'

interface Props {
  contacts?: Contact[]
  error?: Error
  selectedId?: string
  onSelect: (id: string) => void
  onOpen: (id: string) => void
}

export function ContactList({ contacts, error, selectedId, onSelect, onOpen }: Props) {
  const sorted = [...(contacts ?? [])].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  const groups = [
    { key: 'online', title: 'Online', items: sorted.filter((c) => c.presence !== 'offline') },
    { key: 'offline', title: 'Not Online', items: sorted.filter((c) => c.presence === 'offline') },
  ]

  return (
    <div {...stylex.props(styles.list)}>
      <div {...stylex.props(styles.mail)}>
        <EnvelopeIcon />
        <span {...stylex.props(styles.link)}>No new e-mail messages</span>
      </div>
      {error && <div {...stylex.props(styles.notice)}>Sign-in failed: {error.message}</div>}
      {!contacts && !error && <div {...stylex.props(styles.notice)}>Signing in...</div>}
      {contacts &&
        groups.map((group) => (
          <Group key={group.key} title={`${group.title} (${group.items.length})`}>
            {group.items.map((contact) => (
              <div
                key={contact.id}
                {...stylex.props(styles.contact, contact.id === selectedId && styles.selected)}
                onClick={() => onSelect(contact.id)}
                onDoubleClick={() => onOpen(contact.id)}
              >
                <BuddyIcon presence={contact.presence} />
                <span {...stylex.props(styles.ellipsis)}>{label(contact)}</span>
              </div>
            ))}
          </Group>
        ))}
    </div>
  )
}

function label(contact: Contact) {
  const { presence } = contact
  return presence === 'online' || presence === 'offline' ? contact.name : `${contact.name} (${PRESENCE_LABELS[presence]})`
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <div {...stylex.props(styles.groupHeader)} onClick={() => setOpen((o) => !o)}>
        <ChevronCircle open={open} />
        {title}
      </div>
      {open && children}
    </div>
  )
}

const styles = stylex.create({
  list: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '4px 0',
    backgroundColor: '#fff',
    userSelect: 'none',
    cursor: 'default',
  },
  mail: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '2px 8px 6px',
  },
  link: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  notice: {
    padding: '8px 10px',
    color: colors.muted,
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '2px 6px',
    fontWeight: 700,
    color: '#1b3a73',
  },
  contact: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    height: 19,
    margin: '0 4px 0 22px',
    padding: '0 4px',
  },
  selected: {
    backgroundColor: colors.selection,
    color: '#fff',
  },
  ellipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
})
