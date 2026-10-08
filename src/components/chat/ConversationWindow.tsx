import * as stylex from '@stylexjs/stylex'
import type { Contact } from '../../api'
import { useConversation } from '../../hooks/useMessenger'
import { colors } from '../../theme/tokens.stylex'
import { BuddyIcon } from '../icons'
import { MenuBar } from '../xp/MenuBar'
import { Window } from '../xp/Window'
import { Composer } from './Composer'
import { MessageLog } from './MessageLog'

const TOOLBAR = [
  { icon: '👥', label: 'Invite' },
  { icon: '📂', label: 'Send Files' },
  { icon: '📷', label: 'Webcam' },
  { icon: '🎤', label: 'Audio' },
  { icon: '🎯', label: 'Activities' },
  { icon: '🎲', label: 'Games' },
]

interface Props {
  me?: Contact
  contact: Contact
  initialX: number
  initialY: number
  zIndex: number
  active: boolean
  onFocus: () => void
  onClose: () => void
}

export function ConversationWindow({ me, contact, ...frame }: Props) {
  const { messages, send } = useConversation(contact.id)
  const lastReceived = messages.findLast((m) => m.authorId === contact.id)

  return (
    <Window title={`${contact.name} - Conversation`} icon={<BuddyIcon presence="online" />} width={500} height={440} {...frame}>
      <MenuBar items={['File', 'Edit', 'Actions', 'Tools', 'Help']} />
      <div {...stylex.props(styles.toolbar)}>
        {TOOLBAR.map((tool) => (
          <div key={tool.label} {...stylex.props(styles.tool)}>
            <span {...stylex.props(styles.toolIcon)}>{tool.icon}</span>
            {tool.label}
          </div>
        ))}
      </div>
      <div {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.to)}>
            To: <b>{contact.name}</b>
            {contact.email && ` <${contact.email}>`}
          </div>
          <MessageLog messages={messages} me={me} contact={contact} />
          <Composer onSend={send} />
        </div>
        <div {...stylex.props(styles.pictures)}>
          <DisplayPicture contact={contact} />
          {me && <DisplayPicture contact={me} />}
        </div>
      </div>
      <div {...stylex.props(styles.statusBar)}>
        {lastReceived &&
          `Last message received at ${lastReceived.sentAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} on ${lastReceived.sentAt.toLocaleDateString()}.`}
      </div>
    </Window>
  )
}

function DisplayPicture({ contact }: { contact: Contact }) {
  return (
    <div {...stylex.props(styles.picture)}>
      {contact.avatarUrl ? (
        <img src={contact.avatarUrl} alt={contact.name} width={96} height={96} {...stylex.props(styles.image)} />
      ) : (
        <BuddyIcon presence={contact.presence === 'offline' ? 'offline' : 'online'} size={72} />
      )}
    </div>
  )
}

const styles = stylex.create({
  toolbar: {
    display: 'flex',
    flexShrink: 0,
    gap: 2,
    padding: '3px 6px',
    backgroundImage: 'linear-gradient(to bottom, #fbfcff, #dbe5f7)',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#9db3e0',
    userSelect: 'none',
  },
  tool: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 52,
    padding: '2px 4px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: 'transparent', ':hover': '#9db3e0' },
    borderRadius: 3,
    color: '#1b3a73',
    cursor: 'default',
    backgroundColor: { default: null, ':hover': '#fff' },
  },
  toolIcon: {
    fontSize: 22,
    lineHeight: 1.2,
  },
  body: {
    display: 'flex',
    flexGrow: 1,
    minHeight: 0,
    gap: 8,
    padding: 8,
    backgroundImage: 'linear-gradient(to bottom, #e9f0fc, #c6d7f4)',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  to: {
    marginBottom: 4,
    padding: '3px 6px',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#9db3e0',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  pictures: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  picture: {
    display: 'grid',
    placeItems: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8aa6dc',
    borderRadius: 6,
    boxShadow: 'inset 0 0 0 2px #e7eefb',
  },
  image: {
    borderRadius: 4,
    objectFit: 'cover',
  },
  statusBar: {
    flexShrink: 0,
    height: 18,
    padding: '2px 8px',
    boxSizing: 'border-box',
    backgroundColor: colors.face,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#c5c2b2',
    color: '#333',
  },
})
