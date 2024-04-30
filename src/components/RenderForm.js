import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import Form from '@rjsf/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import { customizeValidator } from '@rjsf/validator-ajv8'
import { widgets } from '../custom-ui/CustomWidgets'
import { uiSchema } from '../custom-ui/CustomUISchema'
import { AJV_OPTIONS } from '../utilities/schemaHandlers'
import { deepEquals } from '@rjsf/utils'

function RenderForm (props) {
  /*
  Method to read and render a form based on the user-selected schema
  Arguments:
    props.schemaType (string) = the selected schema type
    props.schema (object) = the selected schema
    props.formData (object) = the form data
  Returns:
    Form object
  */
  const { schemaType, schema, formData } = props
  const formRef = createRef()
  const validator = customizeValidator(AJV_OPTIONS)

  /**
   * Custom onBlur event handler to omit extra data from formData.
   * Based on omitExtraData logic in RJSF Form component.
   */
  const omitExtraDataOnBlur = () => {
    // NOTE: There is a bug in RJSF `omitExtraData` logic causing validation errors.
    // This is a workaround to omit extra data whenever a user leaves an input field.
    // We avoid using `liveOmit` prop due to perf issues.

    // TODO: remove this function once bug is fixed in RJSF.
    const {
      schemaUtils: _schemaUtils,
      schema: _schema,
      formData: _formData
    } = formRef.current.state
    const retrievedSchema = _schemaUtils.retrieveSchema(_schema, _formData)
    const pathSchema = _schemaUtils.toPathSchema(retrievedSchema, '', _formData)
    const fieldNames = formRef.current.getFieldNames(pathSchema, _formData)
    const newFormData = formRef.current.getUsedFormData(_formData, fieldNames)

    if (!deepEquals(_formData, newFormData)) {
      formRef.current.setState({
        ...formRef.current.state,
        formData: newFormData
      })
    }
  }

  async function saveFilePicker (event) {
    /*
    File system access API to select save location
    */
    const data = event.formData
    const fileData = JSON.stringify(data, undefined, 4)
    const opts = {
      suggestedName: `${schemaType}.json`,
      types: [
        {
          description: 'JSON file',
          accept: { 'text/plain': ['.json'] }
        }
      ]
    }
    const handle = await window.showSaveFilePicker(opts)
    const writer = await handle.createWritable()
    await writer.write(new Blob([fileData], { type: 'text/plain' }))
    writer.close()
  }

  if (schema) {
    return (
      schema && <Form
        ref={formRef}
        schema={schema}
        formData={formData}
        validator={validator}
        uiSchema={uiSchema}
        widgets={widgets}
        onSubmit={saveFilePicker}
        onBlur={omitExtraDataOnBlur}
        omitExtraData
        noHtml5Validate >
      </Form>
    )
  } else {
    return (<div>Please select a schema from the dropdown above or autofill data from an existing file.</div>)
  }
}

RenderForm.propTypes = {
  schemaType: PropTypes.string.isRequired,
  schema: PropTypes.object,
  formData: PropTypes.object
}

export default RenderForm
