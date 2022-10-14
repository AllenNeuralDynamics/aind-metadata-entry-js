import React from 'react';
import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import schema_map from '../utilities/constants';

const draft2020 = "https://json-schema.org/draft/2020-12/schema"

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
    return <div> Please select a schema from the dropdown above. </div>
  };

  const preProcessingHelper = (obj) => {
    /* 
    Iterates through schema to make const fields non-fillable
      Grays out const fields (prop.readOnly) and autofills the field with the const value (prop.default)
    */ 
    Object.keys(obj).forEach(key => {

      const prop = obj[key]
      if (prop.const !== undefined) {
        prop.readOnly = true;
        prop.default = prop.const
      }

      if (typeof(prop) === 'object') {
        preProcessingHelper(prop)
      }
    })
  }

  const preProcessing = (key) => {
    /*
    PreProcessing for schema validation
      Replaces $schema field with id to address ajv validation and jsonschema 2020-12 compatibility
      Uses helper function to make const fields non-fillable
    */
    const schema = schema_map[key]
    if (schema.$schema !== undefined && schema.$schema === draft2020) {
      schema.id = schema.$schema;
      delete(schema.$schema)
    }

    preProcessingHelper(schema)
    
    return schema;
  };

  const saveFile = (event) => {
    /* 
    Saves the input metadata as a json schema on client-server
    */
    alert("Saving filled schema as a json file.")
    const FileSaver = require('file-saver');
    const data = event.formData;
    console.log(data)
    const fileData = JSON.stringify(data, undefined, 4);
    const blob = new Blob([fileData], {type: "text/plain"});
    const filename = JSON.stringify(props.schema);
    FileSaver.saveAs(blob, `${filename}.json`);
  };

  current_schema = preProcessing(current_schema)

  return (
    <div>
      <Form schema={current_schema}
      validator={(e) => {validator(e, current_schema)}}
      onSubmit={saveFile} >
      </Form>
    </div>
  );
};


