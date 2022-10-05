import React, {useState} from "react";
//import schemas from "./App";

// TODO: list of options. map filepaths (value) to labels; already have this? what's the pt of orange radish ex
// or, instead of list just put straight in

export default function Dropdown(props) {

  const [value, setValue] = useState('');

  const handleChange = (e) => {
    props.parentCallback(e.target.value);
    setValue(e.target.value);
  };

  return (
    <div>
      <select value={value} onChange={handleChange}>
        <option value='data description'>Data Description Schema</option>
        <option value='procedures'>Procedures Schema</option>
        <option value='subject'>Subject Schema</option>
        <option value='../schemas/processing-schema.json'>Processing Schema</option>
      </select>
    </div>
  );
    /*
    Application to display a dropdown menu of schemas.
        Creates schema objects from filepaths
        Maps schemas to corresponding labels (string) in options (list)
        Renders dropdown menu with options
     */
    
    /*    const data_description = require('../schemas/data-description-schema.json');
    data_description.title = "data_description";
    const procedures = require('../schemas/procedures-schema.json');
    procedures.title = "procedures";
    const subject = require('../schemas/subject-schema.json');
    subject.title = "subject";
    const processing = require('../schemas/processing.json');
    processing.title = "processing";
    */

    /*const options = [
        {label: 'Data Description Schema', value: '../schemas/data-description-schema.json'},
        {label: 'Procedures Schema', value:'../schemas/procedures-schema.json' }, 
        {label: 'Subject Schema', value: '../schemas/subject-schema.json'},
        {label: 'Processing Schema', value: '../schemas/processing.json'}
    ]

    const handleData = (event) => {
        props.handleData(event.target.value)
    }

    const value = ''
    return (
        <div>
            <h1> AIND Metadata Entry </h1>
            <label>
                Select a Schema
                <select value={value} onChange={handleData}>
                   {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                   ))}
                </select>
            </label>
        </div>
    );*/
};
