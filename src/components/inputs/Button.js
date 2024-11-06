import React from 'react'
import PropTypes from 'prop-types'
import { onChangeWrapper } from '../../utils/helpers/ui.helpers'

/**
 * Button component with optional tooltip and styling.
 * Uses onChangeWrapper to handle click events using the provided onClick callback.
 */
function Button (props) {
  const { text, tooltip, onClick, type, extraClassName } = props
  let className = 'btn btn-default'
  if (extraClassName) {
    className = `${className} ${extraClassName}`
  }
  return (
    <button
      type={type ?? 'button'}
      title={tooltip ?? text}
      className={className}
      onClick={(event) => onChangeWrapper(event, onClick)}
    >
      {text}
    </button>
  )
}
Button.propTypes = {
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  extraClassName: PropTypes.string
}

export default Button
