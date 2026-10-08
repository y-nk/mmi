import * as stylex from '@stylexjs/stylex'
import { colors } from '../../theme/tokens.stylex'

export function MenuBar({ items }: { items: string[] }) {
  return (
    <div {...stylex.props(styles.bar)}>
      {items.map((item) => (
        <span key={item} {...stylex.props(styles.item)}>
          {item}
        </span>
      ))}
    </div>
  )
}

const styles = stylex.create({
  bar: {
    display: 'flex',
    flexShrink: 0,
    padding: '1px 0',
    backgroundColor: '#f6f5f0',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#d8d4c4',
    userSelect: 'none',
  },
  item: {
    padding: '2px 6px',
    cursor: 'default',
    backgroundColor: { default: null, ':hover': colors.selection },
    color: { default: null, ':hover': '#fff' },
  },
})
