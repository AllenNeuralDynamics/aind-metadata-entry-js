import React, { createRef, useContext } from 'react'
import Form from '@rjsf/core'
import { customizeValidator } from '@rjsf/validator-ajv8'
import { widgets } from '../custom-ui/CustomWidgets'
import { uiSchema } from '../custom-ui/CustomUISchema'
import Config from '../utils/config'
import { saveToJSONFile } from '../utils/helpers/file.helpers'
// import { toast } from 'react-toastify'
import { Button } from '../components/inputs'
import { SchemaContext } from '../contexts/schema.context'
import { validateToServer } from '../utils/helpers/data-transfer.helpers'
import { toastPromiseWrapper } from '../utils/helpers/ui.helpers'

/**
 * Component to read and render a form based on the user-selected schema.
 * Uses SchemaContext to get states (e.g. schema, formData) to render the form. for the form)
 */
function RenderForm () {
  const { selectedSchemaType, schema, formData } = useContext(SchemaContext)
  const formRef = createRef()
  const validator = customizeValidator(Config.AJV_OPTIONS)

  /**
   * Event handler called after rjsf form validation
   */
  const onValidateForm = () => {
    if (formRef.current.validateForm()) {
      // toast.success('Form is valid. Ready to submit!')
      const formData = formRef.current.state.formData
      toastPromiseWrapper(
        validateToServer(formData, selectedSchemaType),
        'Validating form data...',
        'Form is valid. Ready to submit!'
      )
    }
  }

  /**
   * onSubmit event handler to save validated form data to a JSON file.
   * @param {Event} event The form event
   */
  async function saveFileOnSubmit (event) {
    const formData = event.formData
    const validateThenSave = async (formData, schemaType) => {
      await validateToServer(formData, schemaType)
      await saveToJSONFile(formData, schemaType)
    }
    toastPromiseWrapper(
      validateThenSave(formData, selectedSchemaType),
      'Saving form data...',
      'Form data saved to file!'
    )
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
        uiSchema={widgets}
        widgets={uiSchema}
        onSubmit={saveFileOnSubmit}
        transformErrors={transformErrors}
        omitExtraData
        noHtml5Validate
        focusOnFirstError
      >
        <div className="btn-group" role="group">
           {/* submit button must have type="submit" and onSubmit provided above */}
          <Button text='Save to file' tooltip='Save form data to JSON file' type="submit" extraClassName='btn-primary'/>
          <Button text='Validate' tooltip='Validate form' onClick={onValidateForm}/>
        </div>
      </Form>
    )
  } else {
    return (<div>Please select a schema from the dropdown above or autofill data from an existing file.</div>)
  }
}

export default RenderForm
