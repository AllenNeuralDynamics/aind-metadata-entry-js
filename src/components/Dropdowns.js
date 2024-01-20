import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {compareVersions} from 'compare-versions';

export default function Dropdowns (props) {
    /**
     * Application to render a dropdown menu for schema-selection.
     * Based on selected schema, renders a dropdown menu for version-selection. 
     */
  const [selectedSchemaType, setSelectedSchemaType] = useState('');
  const [selectedSchemaVersion, setSelectedSchemaVersion] = useState('');
  
  const schemaList = props.schemaList

  const schemaTypes = Array.from(
    new Set(schemaList.map((schema) => schema.split('/')[1]))
  );
  schemaTypes.shift()

  const versions = schemaList
  .filter((schema) => {
    const [, schemaType] = schema.split('/');
    return schemaType === selectedSchemaType;
  })
    .map((schema) => schema.split('/')[2])
    .filter((version) => version !== undefined)
    .sort(compareVersions)
    .reverse();

  const handleTypeChange = (event) => {
    props.ParentTypeCallback(event.target.value);
    setSelectedSchemaType(event.target.value);
  };

  const handleVersionChange = (event) => {
    props.ParentVersionCallback(event.target.value);
    setSelectedSchemaVersion(event.target.value);
  };

  return (
    <div>
      <select
        id="schema-type-select"
        value={selectedSchemaType}
        onChange={handleTypeChange}
      >
        <option value="">Select a Schema</option>
        {schemaTypes.map((schemaType) => (
          <option key={schemaType} value={schemaType}>
            {schemaType}
          </option>
        ))}
      </select>
      <br />
      <div></div>
      {selectedSchemaType && (
        <>
          <select
            id="schema-version-select"
            value={selectedSchemaVersion}
            onChange={handleVersionChange}
          >
            <option value="">Select Version</option>
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
  
