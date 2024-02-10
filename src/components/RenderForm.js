import Form from '@rjsf/core'
import 'bootstrap/dist/css/bootstrap.min.css'
import validator from '@rjsf/validator-ajv8'
import { widgets } from '../custom-ui/CustomWidgets'
import { uiSchema } from '../custom-ui/CustomUISchema'

export default function RenderForm (props) {
  /*
  Method to read and render a form based on the user-selected schema
  Arguements:
    props.schema (object) = the selected schema
  Returns:
    Form object
  */
  const schemaName = props.selectedSchemaType
  const schema = props.schema
  const formData = props.data

  async function saveFilePicker (event) {
    /*
    File system access API to select save location
    */
    const data = event.formData
    const fileData = JSON.stringify(data, undefined, 4)
    const opts = {
      suggestedName: `${schemaName}.json`,
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
        noHtml5Validate >
        </Form>
    )
  } else {
    return (<div> Please select a schema from the dropdown above. </div>)
  }
}
