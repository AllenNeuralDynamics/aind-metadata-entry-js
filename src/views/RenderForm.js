import React, { createRef, useContext } from 'react'
import Form from '@rjsf/core'
import { customizeValidator } from '@rjsf/validator-ajv8'
import { widgets } from '../custom-ui/CustomWidgets'
import { uiSchema } from '../custom-ui/CustomUISchema'
import Config from '../utils/config'
import { saveToJSONFile } from '../utils/helpers/file.helpers'
import { toast } from 'react-toastify'
import { Button } from '../components/inputs'
import { SchemaContext } from '../contexts/schema.context'

/**
 * Component to read and render a form based on the user-selected schema.
 * Uses SchemaContext to get states (e.g. schema, formData) to render the form. for the form)
 */
function RenderForm () {
  const { loading, selectedSchemaType, schema, formData } = useContext(SchemaContext)
  const formRef = createRef()
  const validator = customizeValidator(Config.AJV_OPTIONS)

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
    saveToJSONFile(event.formData, selectedSchemaType)
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

  if (loading) {
    return (
      <div className="d-flex align-items-center">
        <div className="spinner-border text-secondary mr-2" role="status"></div>
        <div>Loading...</div>
      </div>
    )
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

export default RenderForm
