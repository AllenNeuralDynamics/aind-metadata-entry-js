import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import moment from 'moment'
import RadioWidget from '@rjsf/material-ui/lib/RadioWidget/RadioWidget'
import CheckboxWidget from '@rjsf/material-ui/lib/CheckboxWidget/CheckboxWidget'
import SelectWidget from '@rjsf/material-ui/lib/SelectWidget/SelectWidget'
import TextWidget from '@rjsf/core/lib/components/widgets/TextWidget'
import React, { useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

const CustomTimeWidget = (props) => {
  const onChange = (selectedDate) => {
    const formattedTime = moment(selectedDate).format('HH:mm:ss')
    props.onChange(formattedTime)
  }
  return (
    <Datetime
      dateFormat={false}
      timeFormat="HH:mm:ss"
      value={props.value ? moment(props.value, 'HH:mm:ss') : undefined}
      onChange={onChange}
    />
  )
}
CustomTimeWidget.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any
}

/**
 * Uses RadioButtons for booleans so
 * users understand undefined default
 */
const CustomCheckboxWidget = (props) => {
  if (props.schema.type === 'boolean') {
    return (
      RadioWidget(props)
    )
  } else {
    return (
      CheckboxWidget(props)
    )
  }
}

/**
 * Custom text widget to enable custom behavior for constants.
 * If const, update formData value to const value using onChange callback, render as readonly (grayed out)
 * If null const, return null (do not display text input)
 * Otherwise, return default text widget
 * @param {*} props RJSF widget props
 * @returns A custom text widget
 */
const CustomTextWidget = (props) => {
  const { schema, onChange, value } = props
  // useLayoutEffect to run effect runs before browser repaints screen (reduce flickering)
  useLayoutEffect(() => {
    if (schema.const !== undefined && value !== schema.const) {
      onChange(schema.const)
    }
  }, [onChange, schema.const, value])

  if (schema.const === null) {
    return null
  } else if (schema.const) {
    return <TextWidget {...props}
    readonly={true}
    value={schema.const}
  />
  } else {
    return <TextWidget {...props}/>
  }
}
CustomTextWidget.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  schema: PropTypes.object
}

/**
 * Uses RadioButtons for booleans so
 * users understand undefined default
 */
const CustomSelectWidget = (props) => {
  const options = []
  for (let i = 0; i < props.options.enumOptions.length; i++) {
    options.push(props.options.enumOptions[i].label)
  }
  if (options.sort().join() !== ['number', 'string'].join()) {
    const newProps = { ...props, hideLabel: true }
    return SelectWidget(newProps)
  }
}

export const widgets = { checkbox: CustomCheckboxWidget, time: CustomTimeWidget, text: CustomTextWidget, select: CustomSelectWidget }
