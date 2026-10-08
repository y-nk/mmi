import * as stylex from '@stylexjs/stylex'
import { useState } from 'react'
import type { Contact, Presence } from '../../api'
import { BuddyIcon } from '../icons'
import { MenuBar } from '../xp/MenuBar'
import { Window } from '../xp/Window'
import { ActionsPane } from './ActionsPane'
import { AdBanner } from './AdBanner'
import { ContactList } from './ContactList'
import { StatusHeader } from './StatusHeader'

const TABS = ['🔔', '😊', '📈', '✈️', '👟', '🛍️', '✒️', '📰']

interface Props {
  me?: Contact
  contacts?: Contact[]
  error?: Error
  zIndex: number
  active: boolean
  onFocus: () => void
  onSetPresence: (presence: Presence) => void
  onOpenChat: (contactId: string) => void
}

export function ContactListWindow({ me, contacts, error, onSetPresence, onOpenChat, ...frame }: Props) {
  const [selectedId, setSelectedId] = useState<string>()

  return (
    <Window
      title="MSN Messenger"
      icon={<BuddyIcon presence="online" />}
      initialX={Math.max(16, window.innerWidth - 320)}
      initialY={16}
      width={280}
      height={Math.min(620, window.innerHeight - 32)}
      {...frame}
    >
      <MenuBar items={['File', 'Contacts', 'Actions', 'Tools', 'Help']} />
      <div {...stylex.props(styles.body)}>
        <StatusHeader me={me} onSetPresence={onSetPresence} />
        <div {...stylex.props(styles.row)}>
          <div {...stylex.props(styles.tabs)}>
            {TABS.map((tab) => (
              <div key={tab} {...stylex.props(styles.tab)}>
                {tab}
              </div>
            ))}
          </div>
          <div {...stylex.props(styles.panel)}>
            <ContactList
              contacts={contacts}
              error={error}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onOpen={onOpenChat}
            />
            <ActionsPane onSendMessage={() => selectedId && onOpenChat(selectedId)} />
          </div>
        </div>
      </div>
      <AdBanner />
    </Window>
  )
}

const styles = stylex.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minHeight: 0,
    backgroundImage: 'linear-gradient(to bottom, #ffffff 0, #dfe8f8 52px, #b7cbef 100%)',
  },
  row: {
    display: 'flex',
    flexGrow: 1,
    minHeight: 0,
  },
  tabs: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    width: 34,
    flexShrink: 0,
    paddingTop: 4,
  },
  tab: {
    display: 'grid',
    placeItems: 'center',
    height: 32,
    marginLeft: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#8aa6dc',
    borderRightWidth: 0,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    backgroundImage: {
      default: 'linear-gradient(to right, #ffffff, #d3e0f7)',
      ':hover': 'linear-gradient(to right, #fffbe8, #f7dfa0)',
    },
    fontSize: 16,
    cursor: 'pointer',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#9db3e0',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    overflow: 'hidden',
  },
})
