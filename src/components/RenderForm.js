import React from 'react';
import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import schema_map from '../utilities/constants';
import { checkDraft2020, preProcessing } from '../utilities/schemaHandlers';

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

  const rawSchema = (schemaKey in schema_map) ? schema_map[schemaKey] : undefined;
  const validator2020 = (rawSchema && checkDraft2020(rawSchema)) ? ajv : undefined;
  const processedSchema = rawSchema ? preProcessing(rawSchema) : undefined;

  const saveFile = (event) => {
    /* 
    Saves the input metadata as a json schema on client-server
    */
    alert("Saving filled schema as a json file.")
    const FileSaver = require('file-saver');
    const data = event.formData;
    const fileData = JSON.stringify(data, undefined, 4);
    const blob = new Blob([fileData], {type: "text/plain"});
    const filename = JSON.stringify(props.schema);
    FileSaver.saveAs(blob, `${filename}.json`);
  };

  const uiSchema = require('../schemas/ui-schemas/ephys-session-ui-schema.json')

  if(processedSchema){
    return (
      <Form schema={processedSchema}
      uiSchema={uiSchema}
      validator={validator2020} noHtml5Validate
      onSubmit={saveFile} >
      </Form>
  );
 } else {
  return(<div> Please select a schema from the dropdown above. </div>)
 }
}