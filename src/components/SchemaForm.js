import React from 'react';
import Form from '@rjsf/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import SaveHelpers from './SaveHelpers';

const onSubmit = ({formData},e)  => {
  /* 
  Saves the metadata as a json schema on client-server
  */
 // event.preventDefault()

 console.log("data submitted: ", e.formData)
};

export default function SchemaForm (props) {
  /*
  Method to read and render a form based on the user-selected schema
  Arguements:
    props.schema (string) = the filepath for selected schema
  Returns: 
    Form
  */

  const schema_path = props.schema
  var current_schema = schema_path
  const formData = {}
  //this.schema = schema_path

  if (schema_path === null) {
    return <div> Select </div>;
  }
  // TODO: replace "filename" with var filename
  current_schema = SaveHelpers.preProcessing(schema_path, "filename")
  console.log(current_schema)
  return (
    <div>
      <Form schema={current_schema}
      onSubmit={() => onSubmit()} >
      </Form>
    </div>
  ) 
}


