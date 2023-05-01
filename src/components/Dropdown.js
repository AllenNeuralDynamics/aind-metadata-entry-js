import React, {useState} from "react";

export default function Dropdown(props) {
  /*
  Application to render a dropdown menu for schema-selection.
    Maps dropdown options to value (string) that corresponds with keys in schema_map.
    Sets value in state to selected schema. 
  */

  const [value, setValue] = useState('');

  const handleChange =  (e) => {
    props.parentCallback(e.target.value);
    setValue(e.target.value);
  };


  return (
    <div>
      <select value={value} onChange={handleChange}>
        <option value=''> Select Schema </option>
        <option value='data_description'> Data Description Schema </option>
        <option value='ephys_rig'> Ephys Rig Schema </option>
        <option value='ephys_session'> Ephys Session Schema </option>
        <option value='acquisition'> Imaging Acquisition Schema </option>
        <option value='instrument'> Imaging Instrument Schema </option>
        <option value='ophys_rig'> Ophys Rig Schema </option>
        <option value='ophys_session'> Ophys Session Schema </option>
        <option value='procedures'> Procedures Schema </option>
        <option value='processing'> Processing Schema </option>
        <option value='subject'> Subject Schema </option>
      </select>
    </div>
  );
};
