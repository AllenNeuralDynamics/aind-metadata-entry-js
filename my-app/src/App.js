import logo from './logo.svg';
import './App.css';
import Form from "@rjsf/core";

// creates js object from json schema
const json_file = require('./schemas/data-description-schema.json')
const schema = json_file;

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Form schema={schema} />
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
