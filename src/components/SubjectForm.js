import React from 'react'
import Form from '@rjsf/core'
import SaverHelpers from './SaveHelpers'
import 'bootstrap/dist/css/bootstrap.min.css';

class SubjectForm extends SaverHelpers {
    /* Renders a form from subject-schema.json and uses function onSubmit from SaverHelpers class to collect the entered data */ 
    constructor(props) {
        super(props); 

        const data_json = require('../schemas/subject-schema.json')
        this.schema = this.preProcessing(data_json, "subject")
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

export default SubjectForm;
