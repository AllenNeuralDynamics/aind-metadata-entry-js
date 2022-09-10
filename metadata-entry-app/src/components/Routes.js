import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "@rjsf/core";
import Homepage from './Homepage.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SampleForm from './SampleForm';
import DataDescriptionForm from './DataDescriptionForm.js';


function FormContainer() {
  /* Routes all the Form Components and Homepage */
  const procedures_json = require('../schemas/procedures-schema.json')
  const procedures_schema = procedures_json;

  const subject_json = require('../schemas/subject-schema.json')
  const subject_schema = subject_json;

  return(
    <Router>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
          <Route exact path="/procedures" element={<Form schema={procedures_schema} />} /> 
          <Route exact path="/subject" element={<Form schema={subject_schema} />} />
          <Route exact path="/data_description" element={<DataDescriptionForm />} />
          <Route exact path="/test" element={<SampleForm />} />

      </Routes>
  </Router>
  )
}

export default FormContainer;
