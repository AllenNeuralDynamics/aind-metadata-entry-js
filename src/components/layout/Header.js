import React from 'react'
import PropTypes from 'prop-types'
import styles from './Header.module.css'

/**
 * Component to display a header with a title and subtitle.
 */
function Header (props) {
  const { title, subtitle } = props
  return (
    <div className={styles.header}>
      <h1>{title}</h1>
      <div>{subtitle}</div>
    </div>
  )
}
Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string
}

export default Header
