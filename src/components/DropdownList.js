import React, {useState} from "react";
import RenderForm from "./RenderForm";

export default function DropdownList(props) {
    /*
    Application to display a dropdown menu of schemas.
        Creates schema objects from filepaths
        Maps schemas to corresponding labels (string) in options (list)
        Renders dropdown menu with options
     */
    const data_description = require('../schemas/data-description-schema.json');
    data_description.title = "data_description";
    const procedures = require('../schemas/procedures-schema.json');
    procedures.title = "procedures";
    const subject = require('../schemas/subject-schema.json');
    subject.title = "subject";
    const processing = require('../schemas/processing.json');
    processing.title = "processing";

    const options = [
        {label: 'Data Description Schema', value: JSON.stringify(data_description)},
        {label: 'Procedures Schema', value: JSON.stringify(procedures)}, 
        {label: 'Subject Schema', value: JSON.stringify(subject)},
        {label: 'Processing Schema', value: JSON.stringify(processing)}
    ]

    const default_schema = '{}'
    const [value, setValue] = useState(default_schema);
    const handleChange = (event) => {
        /**
         * Method to put the selected user-schema into state
         */
        setValue(event.target.value);
    }

    return (
        <div>
            <h1> AIND Metadata Entry </h1>
            <label>
                Select a Metadata Schema
                <select value={value} onChange={handleChange}>
                   {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                   ))}
                </select>
            </label>
        <div>
            <RenderForm schema={JSON.parse(value)} />
        </div>
    </div>

    );
};

