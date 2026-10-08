import * as stylex from '@stylexjs/stylex'
import { useState } from 'react'
import { ConversationWindow } from './components/chat/ConversationWindow'
import { ContactListWindow } from './components/contacts/ContactListWindow'
import { useContacts, useMe } from './hooks/useMessenger'

const MAIN = 'main'

export function App() {
  const { me, setPresence } = useMe()
  const { contacts, error } = useContacts()
  // Open chats in creation order (stable DOM), and the z-order of all windows.
  const [chats, setChats] = useState<string[]>([])
  const [stack, setStack] = useState<string[]>([MAIN])

  const focus = (id: string) => setStack((s) => (s.at(-1) === id ? s : [...s.filter((w) => w !== id), id]))
  const openChat = (contactId: string) => {
    setChats((c) => (c.includes(contactId) ? c : [...c, contactId]))
    focus(contactId)
  }
  const closeChat = (contactId: string) => {
    setChats((c) => c.filter((id) => id !== contactId))
    setStack((s) => s.filter((id) => id !== contactId))
  }
  const frame = (id: string) => ({
    zIndex: stack.indexOf(id) + 1,
    active: stack.at(-1) === id,
    onFocus: () => focus(id),
  })

  return (
    <div {...stylex.props(styles.desktop)}>
      <ContactListWindow
        me={me}
        contacts={contacts}
        error={error}
        onSetPresence={setPresence}
        onOpenChat={openChat}
        {...frame(MAIN)}
      />
      {chats.map((contactId, i) => {
        const contact = contacts?.find((c) => c.id === contactId)
        if (!contact) return null
        return (
          <ConversationWindow
            key={contactId}
            me={me}
            contact={contact}
            initialX={40 + (i % 6) * 28}
            initialY={40 + (i % 6) * 28}
            onClose={() => closeChat(contactId)}
            {...frame(contactId)}
          />
        )
      })}
    </div>
  )
}

const styles = stylex.create({
  desktop: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    // Poor man's "Bliss": sky over a green hill.
    backgroundColor: '#3b7dd8',
    backgroundImage:
      'radial-gradient(ellipse 140% 60% at 30% 105%, #5fae32 0%, #3f8f22 45%, transparent 46%), linear-gradient(to bottom, #2b67c9 0%, #5b93e3 45%, #a9cdf2 75%)',
  },
})
