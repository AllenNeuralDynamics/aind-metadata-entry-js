import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import validator from '@rjsf/validator-ajv8';
import {widgets, uiSchema} from '../custom-ui/TimeUISchema';
import React, {useState, useEffect } from "react";

console.log("time uischema", uiSchema)

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
  const [uiSchema, setUiSchema] = useState({});

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

  function traverseAndGenerateUISchema(schema) {
    const uiSchema = {};
  
    function traverseSchema(currentSchema, currentUISchema, currentPath) {
      for (const key in currentSchema) {
        if (currentSchema[key] !== null) {
          const prop = currentSchema[key];
  
          if (typeof prop === 'object') {
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            currentUISchema[key] = {};
            traverseSchema(prop, currentUISchema[key], newPath);
          }
        }
  
        if (key === 'type' && currentSchema[key] === 'boolean') {
          currentUISchema['ui:widget'] = 'radio';
        }
      }
    }
  
    traverseSchema(schema, uiSchema, '');
  
    return uiSchema;
  }
  

  if(schema){
    const uiSchema = traverseAndGenerateUISchema(schema)
    console.log("ui schema", JSON.stringify(uiSchema))
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
