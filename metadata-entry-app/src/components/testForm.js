import React from 'react'
import Form from '@rjsf/core'

class TestForm extends React.Component {
    constructor() {
        super();

        const data_json = require('../schemas/test.json')
        this.schema = data_json;
    }

    onSubmit = (event) => {
        alert("submitted");
        this.setState(( { formData: Object.assign({}, event.formData) }));
        console.log(this.formData);
    }
    render() {
        return (
            <div>
                <Form schema={this.schema}
                      onSubmit={this.onSubmit}
                      formData={this.formData}>
                </Form>
            </div>
        )
    }
}

export default TestForm;
