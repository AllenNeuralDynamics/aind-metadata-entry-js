import React from 'react'
import Form from '@rjsf/core'
import 'bootstrap/dist/css/bootstrap.min.css';

class SchemaForm extends React.Component {
    /* Renders a form from data-description-schema.json and uses function onSubmit from SaverHelpers class to collect the entered data */
    
    constructor(props) {
        super(props);

        /*Schema Pre-processing*/ 
        const current_schema = props.schema
        console.log("current schema: ", current_schema)
        this.schema = current_schema
        //preProcessing(current_schema, "data description");
    } 
    
    preProcessing (schema, filename) {
        /*
        PreProcessing for schema validation
            Adds id (same as $schema) field to address ajv5 validation and jsonschema 2020-12 compatibility
            Adds title field for filename save
        */
        schema.id = "https://json-schema.org/draft/2020-12/schema";
        schema.title = filename;
        return schema; 
    };

    onSubmit (event) {
        /* 
        Saves the metadata as a json schema on client-server
        */
       // event.preventDefault()

       //console.log("data submitted: ", formData)
        alert("Saving filled schema as a json file.")
        var FileSaver = require('file-saver');
        const formData = event.formData;
        const fileData = JSON.stringify(formData);
        var blob = new Blob([fileData], {type: "text/plain"});
        const filename = this.schema.title
        //console.log(filename)
        //const filename = "filledform"
        FileSaver.saveAs(blob, `${filename}.json`);
    };

    render() {
        return (
            <div>
                <Form schema={this.schema} 
                      onSubmit={this.onSubmit}
                      formData={this.formData} >
                </Form>
            </div>
        )
    }
}

export default SchemaForm;