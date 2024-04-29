import React from 'react'
import PropTypes from 'prop-types'
import Form from '@rjsf/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import { customizeValidator } from '@rjsf/validator-ajv8'
import { widgets } from '../custom-ui/CustomWidgets'
import { uiSchema } from '../custom-ui/CustomUISchema'
import { AJV_OPTIONS } from '../utilities/schemaHandlers'

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
  const validator = customizeValidator(AJV_OPTIONS)

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
      schema && <Form schema={schema}
        formData={formData}
        validator={validator}
        uiSchema={uiSchema}
        widgets={widgets}
        onSubmit={saveFilePicker}
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
