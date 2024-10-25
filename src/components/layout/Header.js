import React from 'react'
import PropTypes from 'prop-types'
import styles from './Header.module.css'

/**
 * Component to display a header with a title and subtitle.
 */
function Header (props) {
  const { title, subtitle, titleClassName, alignCenter } = props
  return (
    <div {...(alignCenter && { className: 'text-center' })}>
      <p className={titleClassName ?? [styles.navy, 'h1'].join(' ')}>{title}</p>
      {typeof subtitle === 'string' ? <div>{subtitle}</div> : subtitle}
    </div>
  )
}
Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleClassName: PropTypes.string,
  alignCenter: PropTypes.bool
}

export default Header
