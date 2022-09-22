import React, {useState} from "react";
import RenderForm from "./RenderForm";
import {DropdownButton} from "bootstrap";
import { Dropdown } from "bootstrap";

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
            <DropdownButton id="dropdown-basic-button" title="Select a Schema">
                <Dropdown.Item as ="button">
                <div onClick={() => setValue((schemas[0]))}>Use Data Description Schema</div>
                </Dropdown.Item>
            </DropdownButton>
            <div>
            <RenderForm schema={value} />
            </div>
    </div>

    );
};

