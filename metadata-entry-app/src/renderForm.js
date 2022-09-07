import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "@rjsf/core";
import Homepage from './Homepage.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  //creates js object from json schema
  const procedures_json = require('./schemas/procedures-schema.json')
  const procedures_schema = procedures_json;

  const subject_json = require('./schemas/subject-schema.json')
  const subject_schema = subject_json;

  const data_json = require('./schemas/data-description-schema.json')
  const data_description_schema = data_json;

  return(
    <Router>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
          <Route exact path="/procedures" element={<Form schema={procedures_schema} />} /> 
          <Route exact path="/subject" element={<Form schema={subject_schema} />} />
          <Route exact path="/data_description" element={<Form schema={data_description_schema} />} />
      </Routes>
  </Router>
  )
}

export default App;
