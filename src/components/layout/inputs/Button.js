import React from 'react'
import PropTypes from 'prop-types'

/**
 * Button component with optional tooltip and pull-right styling
 */
function Button (props) {
  const { text, tooltip, onClick, stylePullRight } = props
  const classNameList = stylePullRight ? ['btn', 'btn-default', 'pull-right'] : ['btn', 'btn-default']
  return (
    <button
      type="button"
      title={tooltip ?? text}
      className={classNameList.join(' ')}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
Button.propTypes = {
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  stylePullRight: PropTypes.bool
}

export default Button
