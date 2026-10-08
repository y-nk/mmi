import * as stylex from '@stylexjs/stylex'
import { useState, type KeyboardEvent } from 'react'
import { fonts } from '../../theme/tokens.stylex'
import { Button } from '../xp/Button'

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('')

  const send = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div>
      <div {...stylex.props(styles.formatBar)}>
        <span {...stylex.props(styles.tool)}>
          <b {...stylex.props(styles.fontGlyph)}>A</b> Font
        </span>
        <span {...stylex.props(styles.tool)}>🙂 ▾</span>
        <span {...stylex.props(styles.tool)}>🎁 ▾</span>
      </div>
      <div {...stylex.props(styles.row)}>
        <textarea
          {...stylex.props(styles.input)}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
        />
        <div {...stylex.props(styles.buttons)}>
          <Button onClick={send} disabled={!text.trim()}>
            <u>S</u>end
          </Button>
          <Button>
            Sea<u>r</u>ch
          </Button>
        </div>
      </div>
    </div>
  )
}

const styles = stylex.create({
  formatBar: {
    display: 'flex',
    gap: 2,
    padding: '4px 0 3px',
    userSelect: 'none',
  },
  tool: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    height: 18,
    padding: '0 5px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: 'transparent', ':hover': '#9db3e0' },
    borderRadius: 2,
    cursor: 'default',
    backgroundColor: { default: null, ':hover': '#fff' },
  },
  fontGlyph: {
    fontFamily: 'Georgia, serif',
    fontSize: 13,
    color: '#1b3a73',
  },
  row: {
    display: 'flex',
    gap: 6,
  },
  input: {
    flexGrow: 1,
    height: 58,
    padding: 4,
    resize: 'none',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#9db3e0',
    fontFamily: fonts.ui,
    fontSize: 13,
    outline: 'none',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
})
