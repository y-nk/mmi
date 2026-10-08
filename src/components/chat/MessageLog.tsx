import * as stylex from '@stylexjs/stylex'
import { useEffect, useRef } from 'react'
import type { Contact, Message } from '../../api'
import { colors } from '../../theme/tokens.stylex'
import { withEmoticons } from './emoticons'

interface Props {
  messages: Message[]
  me?: Contact
  contact: Contact
}

export function MessageLog({ messages, me, contact }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight })
  }, [messages.length])

  const nameOf = (authorId: string) => (authorId === contact.id ? contact.name : (me?.name ?? 'You'))

  return (
    <div ref={ref} {...stylex.props(styles.log)}>
      {contact.presence === 'offline' && (
        <div {...stylex.props(styles.info)}>
          {contact.name} appears to be offline. Messages you send will be delivered when they sign in.
        </div>
      )}
      {messages.map((m) => (
        <div key={m.id} {...stylex.props(styles.message)}>
          <div {...stylex.props(styles.says)}>{nameOf(m.authorId)} says:</div>
          <div {...stylex.props(styles.text)}>{withEmoticons(m.text)}</div>
        </div>
      ))}
    </div>
  )
}

const styles = stylex.create({
  log: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: '6px 8px',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#9db3e0',
    fontSize: 13,
  },
  info: {
    marginBottom: 6,
    padding: '4px 6px',
    backgroundColor: '#fffbe0',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e2d48a',
    color: colors.muted,
    fontSize: 11,
  },
  message: {
    marginBottom: 4,
  },
  says: {
    color: '#555',
    fontSize: 11,
  },
  text: {
    paddingLeft: 12,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
})
