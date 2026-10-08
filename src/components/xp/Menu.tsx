import * as stylex from '@stylexjs/stylex'
import { useEffect, useRef, type ReactNode } from 'react'
import { colors, fonts } from '../../theme/tokens.stylex'

export interface MenuItem {
  label: string
  icon?: ReactNode
  onSelect: () => void
}

/** XP popup menu. Render it inside a `position: relative` anchor. */
export function Menu({ items, onClose }: { items: MenuItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [onClose])

  return (
    <div ref={ref} role="menu" {...stylex.props(styles.menu)}>
      {items.map((item) => (
        <div
          key={item.label}
          role="menuitem"
          {...stylex.props(styles.item)}
          onClick={() => {
            item.onSelect()
            onClose()
          }}
        >
          <span {...stylex.props(styles.icon)}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  )
}

const styles = stylex.create({
  menu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 10,
    minWidth: 150,
    padding: 2,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#aca899',
    boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.3)',
    fontFamily: fonts.ui,
    fontSize: 11,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '2px 18px 2px 4px',
    whiteSpace: 'nowrap',
    cursor: 'default',
    backgroundColor: { default: null, ':hover': colors.selection },
    color: { default: null, ':hover': '#fff' },
  },
  icon: {
    display: 'flex',
    width: 16,
  },
})
