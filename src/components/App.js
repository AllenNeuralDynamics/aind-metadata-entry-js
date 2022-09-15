import React, {useState} from "react";
import SchemaForm from "./SchemaForm";
import SaveHelpers from './SaveHelpers';

export default function App(props) {
    const data_description = require('../schemas/data-description-schema.json');
    const procedures = require('../schemas/procedures-schema.json');
    const subject = require('../schemas/subject-schema.json');

    // TODO: make this an array of sets? {schema, filename} 
    const schemas = [data_description,procedures,subject]

const [value, setValue] = useState(null);

  return ( <div>
             <div> 
               <button onClick={() => setValue((schemas[0]))}>Use Data Description Schema</button>
               <button onClick={() => setValue((schemas[1]))}>Use Procedures Schema</button>
               <button onClick={() => setValue((schemas[2]))}>Use Subject Schema</button>
             </div>
             <div>
                 <SchemaForm schema={value}/>
                 <div>
                     <button onClick={SaveHelpers.onSubmit()}>Submit</button>
                </div>
             </div>
           </div>
         );
}