import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "@rjsf/core";


const schema = {
  title: "Test form",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Employee Name"
    },
    institution: {
      type: "string",
      enum: ["AIND", "AIBS"],
      title: "Institution"
    }
  }
};

function App() {
  return (
      <Form schema={schema} />
  );
}

export default App;
