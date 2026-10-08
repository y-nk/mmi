import * as stylex from '@stylexjs/stylex'

/** The bottom banner ad slot, as every Messenger build had one. */
export function AdBanner() {
  return (
    <div {...stylex.props(styles.slot)}>
      <div {...stylex.props(styles.banner)}>
        <div {...stylex.props(styles.brand)}>
          slack<sup {...stylex.props(styles.sup)}>®</sup>
        </div>
        <div {...stylex.props(styles.headline)}>Now powering your buddy list</div>
        <div {...stylex.props(styles.cta)}>
          <span {...stylex.props(styles.arrow)}>›</span>Connect now!
        </div>
      </div>
    </div>
  )
}

const styles = stylex.create({
  slot: {
    display: 'flex',
    justifyContent: 'center',
    flexShrink: 0,
    padding: '6px 0',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#9db3e0',
  },
  banner: {
    position: 'relative',
    width: 234,
    height: 60,
    boxSizing: 'border-box',
    padding: '4px 6px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#b9c6dc',
    backgroundImage: 'linear-gradient(to bottom, #fff 0%, #eef3fb 60%, #dbe6f7 100%)',
    overflow: 'hidden',
  },
  brand: {
    fontFamily: '"Trebuchet MS", sans-serif',
    fontSize: 14,
    fontWeight: 700,
    fontStyle: 'italic',
    color: '#4a154b',
  },
  sup: {
    fontSize: 7,
  },
  headline: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 13,
    fontWeight: 700,
    color: '#0b3d91',
  },
  cta: {
    position: 'absolute',
    right: 4,
    bottom: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    paddingRight: 4,
    fontFamily: 'Arial, sans-serif',
    fontSize: 11,
    fontWeight: 700,
    color: '#c00',
  },
  arrow: {
    display: 'grid',
    placeItems: 'center',
    width: 13,
    height: 13,
    borderRadius: '50%',
    backgroundColor: '#e2231a',
    color: '#fff',
    lineHeight: 1,
  },
})
