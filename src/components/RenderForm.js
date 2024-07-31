import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import Form from '@rjsf/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import { customizeValidator } from '@rjsf/validator-ajv8'
import { widgets } from '../custom-ui/CustomWidgets'
import { uiSchema } from '../custom-ui/CustomUISchema'
import { AJV_OPTIONS } from '../utilities/schemaHandlers'
import { saveToJSONFile } from '../utilities/fileUtils'
import { toast } from 'react-toastify'

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
   * Event handler to validate the form
   * @param {Event} event The click event
   */
  const onValidateForm = (event) => {
    if (formRef.current.validateForm()) {
      toast.success('Form is valid. Ready to submit!')
    }
    event.target.blur()
  }

  /**
   * onSubmit event handler to save validated form data to a JSON file.
   * @param {Event} event The form event
   */
  async function saveFileOnSubmit (event) {
    saveToJSONFile(event.formData, schemaType)
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
        onSubmit={saveFileOnSubmit}
        omitExtraData
        noHtml5Validate
        focusOnFirstError
      >
        <div className="btn-group" role="group">
          <button title="Save form data to JSON file" type="submit" className="btn btn-primary">Submit</button>
          <button title="Validate form" type="button" className="btn btn-default" onClick={onValidateForm}>Validate</button>
        </div>
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
