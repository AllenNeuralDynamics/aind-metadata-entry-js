import React from 'react'

/**
 * Create an HTML link <a> element formatted as a button or a simple link. Link opens in a new tab.
 * @param {string} url The link URL
 * @param {string} text The text to display
 * @param {string | null} tooltip The tooltip text
 * @param {boolean | null} displayAsButton Flag to display the link as a button
 * @returns HTML <a> element for formatted link
 */
export function getLinkAsButton (url, text, tooltip = '', displayAsButton = false) {
  if (displayAsButton) {
    return (<a href={url} target="_blank" rel='noreferrer' type="button" className="btn btn-default" title={tooltip}>{text}</a>)
  } else {
    return (<a href={url} target="_blank" rel='noreferrer' title={tooltip}>{text}</a>)
  }
}
