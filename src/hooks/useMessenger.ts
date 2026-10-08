import { useCallback } from 'react'
import { api, type Presence } from '../api'
import { usePolling } from './usePolling'

export function useMe() {
  const { data: me, refresh } = usePolling(api.getMe, 60_000)
  const setPresence = useCallback(
    async (presence: Presence) => {
      await api.setPresence(presence)
      refresh()
    },
    [refresh],
  )
  return { me, setPresence }
}

export function useContacts() {
  const { data: contacts, error } = usePolling(api.listContacts, 30_000)
  return { contacts, error }
}

export function useConversation(contactId: string) {
  const load = useCallback(() => api.listMessages(contactId), [contactId])
  const { data: messages = [], refresh } = usePolling(load, 3_000)
  const send = useCallback(
    async (text: string) => {
      await api.sendMessage(contactId, text)
      refresh()
    },
    [contactId, refresh],
  )
  return { messages, send }
}
