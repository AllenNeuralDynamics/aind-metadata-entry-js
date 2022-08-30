import logo from './logo.svg';
import './App.css';
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
