import React from 'react'
import Form from '@rjsf/core'
//import { onSubmit, onSaveToPC } from './SaveHelpers'
import SaverHelpers from './SaveHelpers'
import 'bootstrap/dist/css/bootstrap.min.css';

class TestForm extends SaverHelpers {
    constructor(props) {
        super(props);
        // this.onSubmit = onSubmit.bind(this);
        // this.onSaveToPC = onSaveToPC.bind(this);

        const data_json = require('../schemas/test.json')
        this.schema = data_json;
    }
    
    render() {
        return (
            <div>
                <Form schema={this.schema}
                      onSubmit={this.onSubmit}
                      formData={this.formData}
                      onSave={this.onSaveToPC} >
                        <button onClick={this.onSaveToPC}>Save</button>
                </Form>
            </div>
        )
    }
}

export default TestForm;
