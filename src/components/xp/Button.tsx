import * as stylex from '@stylexjs/stylex'
import type { ButtonHTMLAttributes } from 'react'
import { fonts } from '../../theme/tokens.stylex'

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} {...stylex.props(styles.button)} />
}

const styles = stylex.create({
  button: {
    minWidth: 64,
    minHeight: 23,
    padding: '0 10px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: { default: '#003c74', ':disabled': '#c9c7ba' },
    borderRadius: 3,
    backgroundImage: {
      default: 'linear-gradient(to bottom, #fff, #ecebe6 86%, #d6d0c5)',
      ':active': 'linear-gradient(to bottom, #cdcac3, #e3e3db 8%, #e5e5de 94%, #f2f2f1)',
    },
    boxShadow: {
      default: null,
      ':hover': 'inset -1px 1px #fff0cf, inset 1px 2px #fdd889, inset -2px 2px #fbc761, inset 2px -2px #e5a01a',
      ':disabled': 'none',
    },
    fontFamily: fonts.ui,
    fontSize: 11,
    color: { default: '#000', ':disabled': '#aca899' },
  },
})
