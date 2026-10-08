/** MSN turned typed emoticons into pictures; we turn them into emoji. */
const EMOTICONS: Record<string, string> = {
  ':)': '🙂',
  ':-)': '🙂',
  ':D': '😃',
  ':-D': '😃',
  ';)': '😉',
  ':(': '🙁',
  ':P': '😛',
  ':p': '😛',
  ':O': '😮',
  ':@': '😠',
  '(y)': '👍',
  '(n)': '👎',
  '(L)': '❤️',
  '<3': '❤️',
}

const pattern = new RegExp(
  Object.keys(EMOTICONS)
    .map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'g',
)

export function withEmoticons(text: string) {
  return text.replace(pattern, (match) => EMOTICONS[match])
}
