import React, {useState} from "react";

export default function Dropdown(props) {
  /*
  Application to render a dropdown menu for schema-selection.
    Maps dropdown options to value (string) that corresponds with keys in schema_map.
    Sets value in state to selected schema. 
  */

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
        <option value='processing'>Processing Schema</option>
      </select>
    </div>
  );
};
