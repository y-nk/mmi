import type { Contact, Message, MessengerApi } from './types'

/** In-memory backend so the UI can be worked on without a Slack token. */
export function createMockApi(): MessengerApi {
  const me: Contact = { id: 'me', name: 'JoliB', email: 'jolib@hotmail.com', presence: 'online' }
  const contacts: Contact[] = [
    { id: 'u1', name: 'Charlie Russel', email: 'charlie@hotmail.com', presence: 'busy' },
    { id: 'u2', name: 'Cosmo', email: 'cosmo@msn.com', presence: 'online' },
    { id: 'u3', name: 'Galan', email: 'galan@hotmail.com', presence: 'online' },
    { id: 'u4', name: 'Jerry', email: 'jerry@hotmail.com', presence: 'online' },
    { id: 'u5', name: 'JT://', email: 'jt@passport.com', presence: 'away' },
    { id: 'u6', name: 'gb2300@yahoo.com', email: 'gb2300@yahoo.com', presence: 'offline' },
    { id: 'u7', name: 'geekgoddess', email: 'geekgoddess@hotmail.com', presence: 'offline' },
    { id: 'u8', name: 'jackie_ballew', email: 'jackie_ballew@msn.com', presence: 'offline' },
    { id: 'u9', name: 'Jan Murphy', email: 'jan.murphy@hotmail.com', presence: 'offline' },
    { id: 'u10', name: 'Jennifer', email: 'jennifer@hotmail.com', presence: 'offline' },
    { id: 'u11', name: 'mindy', email: 'mindy@hotmail.com', presence: 'offline' },
    { id: 'u12', name: 'Pam', email: 'pam@hotmail.com', presence: 'offline' },
  ]
  const replies = ['lol', 'brb', 'a/s/l?', 'haha :D', 'nm u?', 'did u see my new display pic?', ':P']
  const history = new Map<string, Message[]>()
  let nextId = 0

  const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 120))
  const post = (contactId: string, authorId: string, text: string) => {
    const messages = history.get(contactId) ?? []
    messages.push({ id: String(nextId++), authorId, text, sentAt: new Date() })
    history.set(contactId, messages)
  }

  return {
    getMe: () => delay({ ...me }),
    listContacts: () => delay(contacts.map((c) => ({ ...c }))),
    setPresence(presence) {
      me.presence = presence
      return delay(undefined)
    },
    listMessages: (contactId) => delay([...(history.get(contactId) ?? [])]),
    sendMessage(contactId, text) {
      post(contactId, me.id, text)
      const contact = contacts.find((c) => c.id === contactId)
      if (contact && contact.presence !== 'offline') {
        const reply = replies[Math.floor(Math.random() * replies.length)]
        setTimeout(() => post(contactId, contactId, reply), 1500)
      }
      return delay(undefined)
    },
  }
}
