import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import validator from '@rjsf/validator-ajv8';
import {widgets, timeUiSchema} from '../custom-ui/TimeUISchema';
import { ephysSessionUiSchema } from '../custom-ui/EphysSessionUiSchema';

export default function RenderForm (props) {
  /*
  Method to read and render a form based on the user-selected schema
  Arguements:
    props.schema (object) = the selected schema
  Returns: 
    Form object 
  */
  const schemaName = props.selectedSchemaType;
  const schema = props.schema;
  const formData = props.data;

  async function saveFilePicker (event) {
    /*
    File system access API to select save location
    */
   const data = event.formData;
   const fileData = JSON.stringify(data, undefined, 4);
   const opts = {
    suggestedName: `${schemaName}.json`,
    types: [
      {
        description: "JSON file",
        accept: {"text/plain": [".json"]}
      }
    ]
   }
   const handle = await window.showSaveFilePicker(opts);
   const writer = await handle.createWritable();
   await writer.write(new Blob([fileData], {type: "text/plain"}));
   writer.close();
  }

  const selectUiSchema = (title) => {
    if(title === "EphysSession") {
      return ephysSessionUiSchema
    }
    else {
      return timeUiSchema
    }

  }
  /* TODO: write a method that generates uischema programatically*/
  /* function traverseAndGenerateUISchema(schema) {
    const uiSchema = {};
  
    function traverseSchema(currentSchema, currentUISchema, currentPath) {
      for (const key in currentSchema) {
        if (currentSchema[key] !== null) {
          const prop = currentSchema[key];
  
          if (typeof prop === 'object') {
            if (key === 'properties') {
              traverseSchema(prop, currentUISchema, currentPath);
            } else if (Array.isArray(prop)) {
              currentUISchema[key] = { items: {} };
              traverseSchema(prop[0], currentUISchema[key].items, currentPath);
            } else {
              const newPath = currentPath ? `${currentPath}.${key}` : key;
              currentUISchema[key] = {};
              traverseSchema(prop, currentUISchema[key], newPath);
            }
          }
        }
  
        if (key === 'type') {
          if (currentSchema[key] === 'boolean') {
            currentUISchema['ui:widget'] = 'radio';
          } else if (key === 'anyOf') {
            currentUISchema['ui:widget'] = 'radio';
          }
        }
      }
    }
  
    // Start the traversal from "properties"
    if (schema.properties) {
      traverseSchema(schema.properties, uiSchema, '');
    }
  
    return uiSchema;
  } */
  

  if(schema){
    /* TODO: Figure out why the ephysuischema works in playground but not here */
    const uiSchema = selectUiSchema(schema.title)
      return (
        schema && <Form schema={schema}
        formData={formData}
        validator={validator}
        uiSchema={uiSchema}
        widgets={widgets}
        onSubmit={saveFilePicker} 
        noHtml5Validate >
        </Form>
      );

 } else {
  return(<div> Please select a schema from the dropdown above. </div>)
 }
}