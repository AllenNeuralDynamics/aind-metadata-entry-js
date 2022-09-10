import Form from '@rjsf/core'
import SaverHelpers from './SaveHelpers'
import 'bootstrap/dist/css/bootstrap.min.css';

class TestForm extends SaverHelpers {
    constructor(props) {
        super(props);

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
