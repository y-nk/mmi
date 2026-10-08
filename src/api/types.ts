export type Presence =
  | 'online'
  | 'busy'
  | 'brb'
  | 'away'
  | 'phone'
  | 'lunch'
  | 'offline'

export const PRESENCE_LABELS: Record<Presence, string> = {
  online: 'Online',
  busy: 'Busy',
  brb: 'Be Right Back',
  away: 'Away',
  phone: 'On The Phone',
  lunch: 'Out To Lunch',
  offline: 'Offline',
}

export interface Contact {
  id: string
  name: string
  email?: string
  avatarUrl?: string
  presence: Presence
}

export interface Message {
  id: string
  authorId: string
  text: string
  sentAt: Date
}

/** Everything the UI needs from a backend. Slack is one implementation. */
export interface MessengerApi {
  getMe(): Promise<Contact>
  listContacts(): Promise<Contact[]>
  setPresence(presence: Presence): Promise<void>
  /** Direct messages with a contact, oldest first. */
  listMessages(contactId: string): Promise<Message[]>
  sendMessage(contactId: string, text: string): Promise<void>
}
