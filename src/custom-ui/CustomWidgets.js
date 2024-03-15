import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import moment from 'moment'
import RadioWidget from '@rjsf/material-ui/lib/RadioWidget/RadioWidget'
import CheckboxWidget from '@rjsf/material-ui/lib/CheckboxWidget/CheckboxWidget'
import TextWidget from '@rjsf/core/lib/components/widgets/TextWidget'
import React from 'react'
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
 * Custom text widget that grays out const fields (readonly) and
 * autofills the field with the const value
 * @param {*} props RJSF widget props
 * @returns A custom text widget
 */
const CustomTextWidget = (props) => {
  if (props.schema.const !== undefined) {
    const newProps = {
      ...props,
      value: props.schema.const,
      readonly: true
    }
    return <TextWidget {...newProps} />
  }
  return <TextWidget {...props} />
}
CustomTextWidget.propTypes = {
  schema: PropTypes.object
}

export const widgets = { checkbox: CustomCheckboxWidget, time: CustomTimeWidget, text: CustomTextWidget }
