import { createMockApi } from './mockApi'
import { createSlackApi } from './slackApi'

export * from './types'

const token = import.meta.env.VITE_SLACK_TOKEN

export const api = token ? createSlackApi(token) : createMockApi()
