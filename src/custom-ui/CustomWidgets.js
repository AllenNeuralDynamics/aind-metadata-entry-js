import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import moment from 'moment'
import RadioWidget from '@rjsf/material-ui/lib/RadioWidget/RadioWidget'
import CheckboxWidget from '@rjsf/material-ui/lib/CheckboxWidget/CheckboxWidget'
import TextWidget from '@rjsf/core/lib/components/widgets/TextWidget'
import React, { useEffect } from 'react'
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
 * If string const: update formData value to const value, and return readonly text widget
 * If null const: update formData value to null and return null
 * Otherwise, return default text widget
 * @param {*} props RJSF widget props
 * @returns A custom text widget
 */
const CustomTextWidget = (props) => {
  const { schema, value, onChange, readonly } = props
  useEffect(() => {
    if (schema.const !== undefined && value !== schema.const) {
      onChange(schema.const)
    }
  }, [schema.const, onChange, value])
  if (schema.const === null) {
    return null
  }
  return <TextWidget{...props}
    readonly={schema.const ? true : readonly}
    onChange={schema.const ? () => {} : onChange}
    value={schema.const !== undefined ? schema.const : value}
  />
}
CustomTextWidget.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  schema: PropTypes.object,
  readonly: PropTypes.bool
}

export const widgets = { checkbox: CustomCheckboxWidget, time: CustomTimeWidget, text: CustomTextWidget }
