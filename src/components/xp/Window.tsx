import * as stylex from '@stylexjs/stylex'
import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { fonts } from '../../theme/tokens.stylex'

interface Props {
  title: string
  icon?: ReactNode
  initialX: number
  initialY: number
  width: number
  height: number
  zIndex: number
  active: boolean
  onFocus: () => void
  onClose?: () => void
  children: ReactNode
}

/** A draggable Windows XP (Luna) window frame. */
export function Window(props: Props) {
  const { title, icon, width, height, zIndex, active, onFocus, onClose, children } = props
  const [pos, setPos] = useState({ x: props.initialX, y: props.initialY })
  const [rolledUp, setRolledUp] = useState(false)
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    setPos({ x: e.clientX - drag.current.dx, y: Math.max(0, e.clientY - drag.current.dy) })
  }

  return (
    <div
      {...stylex.props(styles.frame, styles.geometry(pos.x, pos.y, width, rolledUp ? 'auto' : height, zIndex))}
      onPointerDownCapture={onFocus}
    >
      <div
        {...stylex.props(styles.titleBar, !active && styles.titleBarInactive)}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={() => (drag.current = null)}
        onDoubleClick={() => setRolledUp((r) => !r)}
      >
        {icon}
        <span {...stylex.props(styles.title)}>{title}</span>
        <TitleButton kind="minimize" onClick={() => setRolledUp((r) => !r)} />
        <TitleButton kind="maximize" />
        <TitleButton kind="close" onClick={onClose} />
      </div>
      {!rolledUp && <div {...stylex.props(styles.body)}>{children}</div>}
    </div>
  )
}

const GLYPHS = {
  minimize: <rect x="4" y="11" width="7" height="3" fill="#fff" />,
  maximize: <path d="M3.5 3.5h9v9h-9z M3.5 4.5h9" fill="none" stroke="#fff" strokeWidth="2" />,
  close: <path d="M4 4l8 8M12 4l-8 8" stroke="#fff" strokeWidth="2" />,
}

function TitleButton({ kind, onClick }: { kind: keyof typeof GLYPHS; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label={kind}
      onClick={onClick}
      {...stylex.props(styles.titleButton, kind === 'close' && styles.closeButton)}
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        {GLYPHS[kind]}
      </svg>
    </button>
  )
}

const styles = stylex.create({
  frame: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 3px 3px',
    backgroundColor: '#0842d6',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    boxShadow: '2px 3px 10px rgba(0, 0, 0, 0.35)',
    fontFamily: fonts.ui,
    fontSize: 11,
  },
  geometry: (x: number, y: number, width: number, height: number | string, zIndex: number) => ({
    left: x,
    top: y,
    width,
    height,
    zIndex,
  }),
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    height: 30,
    flexShrink: 0,
    margin: '0 -3px',
    padding: '0 5px 0 6px',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundImage:
      'linear-gradient(to bottom, #0058ee 0%, #3a93ff 4%, #288eff 6%, #127dff 8%, #036ffc 10%, #0262ee 14%, #0057e5 20%, #0054e3 24%, #0055eb 56%, #005bf5 66%, #026afe 76%, #0062ef 86%, #0052d6 92%, #0040ab 94%, #003092 100%)',
    color: '#fff',
    userSelect: 'none',
    touchAction: 'none',
  },
  titleBarInactive: {
    backgroundImage:
      'linear-gradient(to bottom, #7697e7 0%, #7e9ee3 3%, #94afe8 6%, #97b4e9 8%, #82a5e4 14%, #7c9fe2 17%, #7996de 25%, #7b99e1 56%, #82a9e9 81%, #80a5e7 89%, #7b96e1 94%, #7a93df 100%)',
  },
  title: {
    flexGrow: 1,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontFamily: fonts.title,
    fontSize: 13,
    fontWeight: 700,
    textShadow: '1px 1px #0f1089',
  },
  titleButton: {
    display: 'grid',
    placeItems: 'center',
    width: 21,
    height: 21,
    padding: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#fff',
    borderRadius: 3,
    backgroundImage:
      'radial-gradient(circle at 90% 90%, #0054e9 0%, #2263d5 55%, #4479e4 70%, #a3bbec 90%, #fff 100%)',
    cursor: 'pointer',
    filter: { default: null, ':hover': 'brightness(1.15)' },
  },
  closeButton: {
    backgroundImage:
      'radial-gradient(circle at 90% 90%, #cc4600 0%, #dc6527 55%, #cd7546 70%, #ffccb2 90%, #fff 100%)',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minHeight: 0,
    backgroundColor: '#fff',
  },
})
