import React from 'react';
import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import SaveHelpers from './SaveHelpers';

export default function SchemaForm(props) {
  /*
  Method to read and render a form based on the user-selected schema
  Arguements:
    props.schema (string) = the filepath for selected schema
  Returns: 
  */

  const schema_path = props.schema
  console.log("schema path", props.schema)
  const current_schema = schema_path

  // current_schema = SaveHelpers.preProcessing(schema_path, "filename")
  //this.schema = this.preProcessing(data_json, "procedures")

  if (schema_path === null) {
      return <div> Select </div>;
    }
    return (
      <div>
        <Form schema={current_schema} >
        </Form>
      </div>
    ) 
}
