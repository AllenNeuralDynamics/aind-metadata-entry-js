import React from 'react'
import Form from '@rjsf/core'
import SaverHelpers from './SaveHelpers'
import 'bootstrap/dist/css/bootstrap.min.css';

class DataDescriptionForm extends SaverHelpers {
    /* Renders a form from data-description-schema.json and uses function onSubmit from SaverHelpers class to collect the entered data */ 
    constructor(props) {
        super(props);

        /*Schema Pre-processing*/ 
        const data_json = require('../schemas/data-description-schema.json');
        this.schema = this.preProcessing(data_json, "data description");
    } 
    
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

export default DataDescriptionForm;
