import React from 'react'
import PropTypes from 'prop-types'

/**
 * Link component that renders as a button or a simple link. Link opens in a new tab.
 */
function LinkButton (props) {
  const { url, text, tooltip, displayAsButton } = props
  return (
    <a href={url} target="_blank" rel='noreferrer'
      title={tooltip}
      {...displayAsButton && {
        type: 'button',
        className: 'btn btn-default'
      }}
    >
      {text}
    </a>
  )
}
LinkButton.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  displayAsButton: PropTypes.bool
}

export default LinkButton
