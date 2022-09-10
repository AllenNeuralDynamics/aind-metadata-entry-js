import Form from '@rjsf/core'
import SaverHelpers from './SaveHelpers'
import 'bootstrap/dist/css/bootstrap.min.css';

class TestForm extends SaverHelpers {
    constructor(props) {
        super(props);
        // If I already have filled out a shcema, look for it and put it in state.

        const data_json = require('../schemas/sample-schema.json')
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

export default TestForm;
