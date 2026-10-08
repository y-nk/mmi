import * as stylex from '@stylexjs/stylex'
import { useState, type ReactNode } from 'react'
import { ChevronCircle, PlusIcon } from '../icons'

interface Props {
  onSendMessage: () => void
}

/** The "I want to..." task pane at the bottom of the contact list. */
export function ActionsPane({ onSendMessage }: Props) {
  const [open, setOpen] = useState(true)
  const actions: { icon: ReactNode; label: string; onClick?: () => void }[] = [
    { icon: <PlusIcon />, label: 'Add a Contact' },
    { icon: '💬', label: 'Send an Instant Message', onClick: onSendMessage },
    { icon: '📁', label: 'Send a File or Photo' },
    { icon: '🎲', label: 'Play a Game' },
    { icon: '🔍', label: 'Search for a Contact' },
  ]

  return (
    <div {...stylex.props(styles.pane)}>
      <div {...stylex.props(styles.header)} onClick={() => setOpen((o) => !o)}>
        I want to...
        <ChevronCircle open={!open} double />
      </div>
      {open &&
        actions.map((action) => (
          <div key={action.label} {...stylex.props(styles.action)} onClick={action.onClick}>
            <span {...stylex.props(styles.icon)}>{action.icon}</span>
            <span {...stylex.props(styles.label)}>{action.label}</span>
          </div>
        ))}
      <div {...stylex.props(styles.more)}>
        More
        <span>▸</span>
      </div>
    </div>
  )
}

const styles = stylex.create({
  pane: {
    flexShrink: 0,
    backgroundImage: 'linear-gradient(to bottom, #f1f5fd, #d4e1f7)',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#9db3e0',
    userSelect: 'none',
    cursor: 'default',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 6px 3px 8px',
    fontWeight: 700,
    color: '#1b3a73',
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    height: 19,
    paddingLeft: 12,
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    width: 16,
    fontSize: 12,
  },
  label: {
    textDecoration: { default: null, ':hover': 'underline' },
    color: { default: null, ':hover': '#0b3d91' },
  },
  more: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4,
    padding: '4px 10px',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#b7c9ec',
    backgroundImage: 'linear-gradient(to bottom, #e3ebfa, #c4d5f3)',
    fontWeight: 700,
    color: '#1b3a73',
  },
})
