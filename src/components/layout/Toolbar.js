import React from 'react'
import PropTypes from 'prop-types'

/**
 * Wrapper Toolbar component to style a toolbar.
 * Renders any child components (e.g. buttons, dropdowns).
 * @example <Toolbar> <LinkButton> <SelectDropdown> </Toolbar>
 */
function Toolbar (props) {
  return (
    <div className="btn-toolbar" role="toolbar">
      {props.children}
    </div>
  )
}
Toolbar.propTypes = {
  children: PropTypes.node.isRequired
}

export default Toolbar
