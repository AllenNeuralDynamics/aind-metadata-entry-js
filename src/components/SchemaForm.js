import React from 'react';
import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RenderForm (props) {
  /*
  Method to read and render a form based on the user-selected schema
  Arguements:
    props.schema (string) = the filepath for selected schema
  Returns: 
    Form object 
  */
  
  var current_schema = props.schema

  if (current_schema === null) {
    return <div> Select </div>
  };

  const preProcessing = (schema) => {
    /*
    PreProcessing for schema validation
      Adds id (same as $schema) field to address ajv5 validation and jsonschema 2020-12 compatibility
    */
    schema.id = "https://json-schema.org/draft/2020-12/schema";
    return schema;
  };

  const saveFile = (event) => {
    /* 
    Saves the metadata as a json schema on client-server
    */
    alert("Saving filled schema as a json file.")
    var FileSaver = require('file-saver');
    const data = event.formData;
    const fileData = JSON.stringify(data);
    var blob = new Blob([fileData], {type: "text/plain"});
    const filename = props.schema.title
    FileSaver.saveAs(blob, `${filename}.json`);
  };

  current_schema = preProcessing(current_schema)

  return (
    <div>
      <Form schema={current_schema}
      onSubmit={saveFile} >
      </Form>
    </div>
  ) 
}


