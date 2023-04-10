import React from 'react';
import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import schema_map from '../utilities/constants';
import { checkDraft2020, preProcessing } from '../utilities/schemaHandlers';
import EphysSessionUISchema from '../schemas/ui-schemas/EphysSessionUISchema';
import TimeSelection from '../schemas/ui-schemas/TimeSelectionUISchema';

const Ajv2020 = require("ajv/dist/2020")

const ajv = new Ajv2020()

export default function RenderForm (props) {
  /*
  Method to read and render a form based on the user-selected schema
  Arguements:
    props.schema (object) = the selected schema
  Returns: 
    Form object 
  */

  const schemaKey = props.schema;
  const formData = props.data

  const rawSchema = (schemaKey in schema_map) ? schema_map[schemaKey] : undefined;
  const validator2020 = (rawSchema && checkDraft2020(rawSchema)) ? ajv : undefined;
  const processedSchema = rawSchema ? preProcessing(rawSchema) : undefined;

  async function saveFilePicker (event) {
    /*
    File system access API to select save location
    */
   const filename = JSON.stringify(schemaKey);
   const data = event.formData;
   const fileData = JSON.stringify(data, undefined, 4);
   const opts = {
    suggestedName: `${filename}.json`,
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
  
  // TODO: make a function for uiSchema selection based on selectedschema
  if(processedSchema){
    if (schemaKey === "ephys session") {
      return (
        <Form schema={processedSchema}
        formData={formData}
        uiSchema={EphysSessionUISchema}
        validator={validator2020} noHtml5Validate
        onSubmit={saveFilePicker} >
        </Form>
    )}
    else { 
      return (
        <Form schema={processedSchema}
        formData={formData}
        uiSchema={TimeSelection}
        validator={validator2020} noHtml5Validate
        onSubmit={saveFilePicker} >
        </Form>
      )};
 } else {
  return(<div> Please select a schema from the dropdown above. </div>)
 }
}
