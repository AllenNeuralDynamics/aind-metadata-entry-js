import React from 'react';
import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import schema_map from '../utilities/constants';

export default function RenderForm (props) {
  /*
  Method to read and render a form based on the user-selected schema
  Arguements:
    props.schema (object) = the selected schema
  Returns: 
    Form object 
  */
  let current_schema = props.schema;

  if (current_schema === '') {
    return <div> Please select a schema. </div>
  };

  const preProcessing = (key) => {
    /*
    PreProcessing for schema validation
      Adds id (same as $schema) field to address ajv5 validation and jsonschema 2020-12 compatibility
      Makes const fields in schemas non-fillable by adding readOnly
    */
    const schema = schema_map[key]
    if (schema.$schema !== undefined) {
      schema.id = schema.$schema;
    }

    const properties = schema.properties
    for (const [name, prop] of Object.entries(properties)) {
      if(prop.const !== undefined) { 
        prop.readOnly = true;
      }
    }
    
    return schema;
  }; 

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
  current_schema = preProcessing(current_schema);

  return (
    <div>
      <Form schema={current_schema}
      onSubmit={saveFile} >
      </Form>
    </div>
  );
};


