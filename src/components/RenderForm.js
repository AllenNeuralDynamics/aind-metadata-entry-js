import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import Form from '@rjsf/core'
import { customizeValidator } from '@rjsf/validator-ajv8'
import { widgets } from '../custom-ui/CustomWidgets'
import { uiSchema } from '../custom-ui/CustomUISchema'
import Config from '../utils/config'
import { saveToJSONFile } from '../utils/helpers/file.helpers'
import { toast } from 'react-toastify'
import { Button } from './layout/inputs'

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
  const validator = customizeValidator(Config.ajvOptions)

  /**
   * Event handler called after rjsf form validation
   */
  const onValidateForm = () => {
    if (formRef.current.validateForm()) {
      toast.success('Form is valid. Ready to submit!')
    }
  }

  /**
   * onSubmit event handler to save validated form data to a JSON file.
   * @param {Event} event The form event
   */
  async function saveFileOnSubmit (event) {
    saveToJSONFile(event.formData, schemaType)
  }

  /**
   * Transforms errors to prepend property name to error message
   * @param {object[]} errors List of errors from JSON Schema validation
   * @returns {object[]} Transformed errors
   */
  function transformErrors (errors) {
    return errors.map(error => {
      if (error.property) { error.stack = `${error.property}: ${error.stack}` }
      return error
    })
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
        transformErrors={transformErrors}
        omitExtraData
        noHtml5Validate
        focusOnFirstError
      >
        <div className="btn-group" role="group">
           {/* submit button must have type="submit" and onSubmit provided above */}
          <Button text='Submit' tooltip='Save form data to JSON file' type="submit" extraClassName='btn-primary'/>
          <Button text='Validate' tooltip='Validate form' onClick={onValidateForm}/>
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
