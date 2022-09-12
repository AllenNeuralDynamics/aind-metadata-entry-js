import React from 'react'
import Form from '@rjsf/core'
import SaverHelpers from './SaveHelpers'
import 'bootstrap/dist/css/bootstrap.min.css';

class ProceduresForm extends SaverHelpers {
    /* Renders a form from procedures-schema.json and uses function onSubmit from SaverHelpers class to collect the entered data */ 
    constructor(props) {
        super(props);

        const data_json = require('../schemas/procedures-schema.json')
        this.schema = data_json;
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

export default ProceduresForm;
