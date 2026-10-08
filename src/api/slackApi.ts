import { createSlackClient } from './slackClient'
import type { Contact, Message, MessengerApi, Presence } from './types'

interface SlackProfile {
  real_name?: string
  display_name?: string
  email?: string
  image_192?: string
  status_text?: string
  status_emoji?: string
}

interface SlackUser {
  id: string
  name: string
  deleted?: boolean
  is_bot?: boolean
  profile: SlackProfile
}

interface SlackMessage {
  ts: string
  user?: string
  text: string
  subtype?: string
}

type CustomStatus = Exclude<Presence, 'online' | 'offline'>

/** MSN statuses don't exist in Slack, so they're stored as a custom status. */
const STATUSES: Record<CustomStatus, { text: string; emoji: string; keywords: string[] }> = {
  busy: { text: 'Busy', emoji: ':no_entry:', keywords: ['busy', 'meeting', 'focus'] },
  brb: { text: 'Be Right Back', emoji: ':hourglass:', keywords: ['brb', 'be right back'] },
  away: { text: 'Away', emoji: ':clock3:', keywords: ['away', 'vacation', 'ooo'] },
  phone: { text: 'On The Phone', emoji: ':telephone_receiver:', keywords: ['phone', 'call', 'huddle'] },
  lunch: { text: 'Out To Lunch', emoji: ':hamburger:', keywords: ['lunch'] },
}

function statusFromProfile(profile: SlackProfile): Presence {
  const text = (profile.status_text ?? '').toLowerCase()
  for (const [presence, status] of Object.entries(STATUSES)) {
    if (profile.status_emoji === status.emoji || status.keywords.some((k) => text.includes(k))) {
      return presence as Presence
    }
  }
  return 'online'
}

function toContact(user: SlackUser, presence: Presence): Contact {
  return {
    id: user.id,
    name: user.profile.display_name || user.profile.real_name || user.name,
    email: user.profile.email,
    avatarUrl: user.profile.image_192,
    presence,
  }
}

function decodeEntities(text: string) {
  return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

export function createSlackApi(token: string): MessengerApi {
  const call = createSlackClient(token)
  const dmChannels = new Map<string, string>()
  let myId: Promise<string> | undefined

  const getMyId = () => {
    myId ??= call<{ user_id: string }>('auth.test').then((r) => r.user_id)
    return myId
  }

  const openDm = async (userId: string) => {
    let channel = dmChannels.get(userId)
    if (!channel) {
      const res = await call<{ channel: { id: string } }>('conversations.open', { users: userId })
      channel = res.channel.id
      dmChannels.set(userId, channel)
    }
    return channel
  }

  const getPresence = (user: string) =>
    call<{ presence: 'active' | 'away'; manual_away?: boolean }>('users.getPresence', { user })

  const listUsers = async () => {
    const users: SlackUser[] = []
    let cursor: string | undefined
    do {
      const res = await call<{ members: SlackUser[]; response_metadata?: { next_cursor?: string } }>(
        'users.list',
        { limit: 200, cursor },
      )
      users.push(...res.members)
      cursor = res.response_metadata?.next_cursor || undefined
    } while (cursor)
    return users
  }

  return {
    async getMe() {
      const id = await getMyId()
      const [{ user }, presence] = await Promise.all([
        call<{ user: SlackUser }>('users.info', { user: id }),
        getPresence(id),
      ])
      // Our own "active" flag depends on other Slack clients, so only the
      // explicit away switch counts as "Appear Offline".
      return toContact(user, presence.manual_away ? 'offline' : statusFromProfile(user.profile))
    },

    async listContacts() {
      const [me, users] = await Promise.all([getMyId(), listUsers()])
      const people = users.filter((u) => !u.deleted && !u.is_bot && u.id !== 'USLACKBOT' && u.id !== me)
      // Slack has no bulk presence endpoint: one call per user.
      const presences = await Promise.all(people.map((u) => getPresence(u.id)))
      return people.map((user, i) =>
        toContact(user, presences[i].presence === 'active' ? statusFromProfile(user.profile) : 'offline'),
      )
    },

    async setPresence(presence) {
      await call('users.setPresence', { presence: presence === 'offline' ? 'away' : 'auto' })
      const status = presence === 'online' || presence === 'offline' ? undefined : STATUSES[presence]
      await call('users.profile.set', {
        profile: JSON.stringify({
          status_text: status?.text ?? '',
          status_emoji: status?.emoji ?? '',
        }),
      })
    },

    async listMessages(contactId) {
      const channel = await openDm(contactId)
      const res = await call<{ messages: SlackMessage[] }>('conversations.history', { channel, limit: 50 })
      return res.messages
        .filter((m) => !m.subtype && m.user)
        .reverse()
        .map(
          (m): Message => ({
            id: m.ts,
            authorId: m.user!,
            text: decodeEntities(m.text),
            sentAt: new Date(Number(m.ts) * 1000),
          }),
        )
    },

    async sendMessage(contactId, text) {
      const channel = await openDm(contactId)
      await call('chat.postMessage', { channel, text })
    },
  }
}
