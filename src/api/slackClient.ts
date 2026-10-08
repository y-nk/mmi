const BASE_URL = 'https://slack.com/api/'

export class SlackError extends Error {
  readonly code: string

  constructor(method: string, code: string) {
    super(`${method}: ${code}`)
    this.code = code
  }
}

type Params = Record<string, string | number | boolean | undefined>

/**
 * Minimal Slack Web API caller.
 * The token goes in a form-encoded body (not a header) so the request stays
 * a CORS "simple request" and works straight from the browser.
 */
export function createSlackClient(token: string) {
  return async function call<T>(method: string, params: Params = {}): Promise<T> {
    const body = new URLSearchParams({ token })
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) body.set(key, String(value))
    }
    const res = await fetch(BASE_URL + method, { method: 'POST', body })
    const data = await res.json()
    if (!data.ok) throw new SlackError(method, data.error ?? `http_${res.status}`)
    return data as T
  }
}

export type SlackCall = ReturnType<typeof createSlackClient>
