import logo from './logo.svg';
import './App.css';
import Form from "@rjsf/core";

const schema = {
  title: "Data Description Schema",
  type: "object",
  properties: {
    version: {
      type: "string",
      const: "0.1.0",
      description: "schema version",
      title: "Version"
    },
    license: {
      type: "string",
      const: "CC-BY-4.0",
      title: "License"
    },
    data_level: {
      type: "string",
      enum: ["raw data", "derived data"],
      title: "Data Level"
    },
    name: {
      type: "string",
      description: "name of data, conventionally also the name of the directory containing all data and metadata",
      title: "Name"
    },
    institution: {
      type: "string",
      enum: ["AIND", "AIBS"],
      title: "Institution"
    }, 
    group: {
      type: "string",
      enum: ["ephys", "ophys", "MSMA", "behavior"],
      title: "Group"
    },
    project_name: {
      type: "string",
      title: "Project Name"
    },
    project_id: {
      type: "string",
      title: "Project ID"
    }
  }
};

function App() {
  return (
    <div className="App">
      <Form schema={schema} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
