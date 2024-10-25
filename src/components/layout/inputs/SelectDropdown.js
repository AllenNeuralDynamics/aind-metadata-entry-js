import React from 'react'
import PropTypes from 'prop-types'
import styles from './SelectDropdown.module.css'
import { onChangeWrapper } from '../../../utils/helpers/ui.helpers'

/**
 * Select component that renders a dropdown menu.
 * Uses onChangeWrapper to handle change events using the provided onChange callback.
 */
function SelectDropdown (props) {
  const { title, value, onChange, disabled, options } = props
  return (
    <select
      className={['btn', 'btn-default', styles.dropdown].join(' ')}
      title={title}
      value={value}
      onChange={(event) => onChangeWrapper(event, onChange)}
      disabled={disabled}
      placeholder=''
    >
      <option default>{title}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.title ?? option.value}
        </option>
      ))}
  </select>
  )
}
SelectDropdown.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      title: PropTypes.string
    })
  ).isRequired
}

export default SelectDropdown
