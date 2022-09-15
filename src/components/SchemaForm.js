import React from 'react';
import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import SaveHelpers from './SaveHelpers';


// TODO: FIX ONSUBMIT (CURRENTLY OCCURING ON THE RENDER OF THE FORM, RATHER THAN THE CLICK OF THE SUBMIT BUTTON)
export default function SchemaForm (props) {
  /*
  Method to read and render a form based on the user-selected schema
  Arguements:
    props.schema (string) = the filepath for selected schema
  Returns: 
    Form
  */
  const schema_path = props.schema
  console.log("schema path", props.schema)
  var current_schema = schema_path

  if (schema_path === null) {
      return <div> Select </div>;
    }
    // TODO: replace "filename" with var filename
    current_schema = SaveHelpers.preProcessing(schema_path, "filename")
    return (
      <div>
        <Form schema={current_schema} 
        onSubmit={SaveHelpers.onSubmit}>
        </Form>
      </div>
    ) 
}
