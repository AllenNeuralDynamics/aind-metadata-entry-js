import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "@rjsf/core";

// creates js object from json schema
const json_file = require('./schemas/procedures-schema.json')
const schema = json_file;

function App() {
  return (
      <Form schema={schema} />
  );
}

export default App;
