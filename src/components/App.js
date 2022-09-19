import React, {useState} from "react";
import RenderForm from "./SchemaForm";

export default function App(props) {
    const data_description = require('../schemas/data-description-schema.json');
    data_description.title = "data_description";
    const procedures = require('../schemas/procedures-schema.json');
    procedures.title = "procedures";
    const subject = require('../schemas/subject-schema.json');
    subject.title = "subject";
    const processing = require('../schemas/processing.json');
    processing.title = "processing";

    // TODO: make this an array of sets? {schema, filename} 
    const schemas = [data_description,procedures,subject, processing];
    
    const [value, setValue] = useState(null);

    return (

        <div>
            <div> 
                <button onClick={() => setValue((schemas[0]))}>Use Data Description Schema</button>
                <button onClick={() => setValue((schemas[1]))}>Use Procedures Schema</button>
                <button onClick={() => setValue((schemas[2]))}>Use Subject Schema</button>
                <button onClick={() => setValue((schemas[3]))}>Use Processing Schema</button>
            </div>
        <div>
            <RenderForm schema={value} />
        </div>
    </div>
    );
};