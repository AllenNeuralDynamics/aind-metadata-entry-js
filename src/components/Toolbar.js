import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {compareVersions} from 'compare-versions';
import styles from './Toolbar.module.css';

export default function Toolbar (props) {
    /**
     * Component to render a dropdown menu for schema-selection.
     * Based on selected schema, renders a dropdown menu for version-selection. 
     * Gives user the option to autofill the form with previously input data
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
        className={["btn", "btn-default", styles.dropdown].join(" ")}
        title='Select a schema'
        value={selectedSchemaType}
        onChange={handleTypeChange}
      >
        <option value="">Select schema</option>
        {schemaTypes.map((schemaType) => (
          <option key={schemaType} value={schemaType}>
            {schemaType}
          </option>
        ))}
      </select>
      <select
        id="schema-version-select"
        className={["btn", "btn-default", styles.dropdown].join(" ")}
        title='Select a version'
        value={selectedSchemaVersion}
        onChange={handleVersionChange}
        disabled={!selectedSchemaType}
      >
        <option value="">Select version</option>
        {versions.map((version) => (
          <option key={version} value={version}>
            {version}
          </option>
        ))}
      </select>
      <button
        title="Autofill with existing data"
        type="button"
        className={["btn", "btn-default", styles.btnRight].join(" ")}
        onClick={props.handleRehydrate}
        disabled={!selectedSchemaType}
      >
        Autofill with existing data
      </button>
    </div>
  );
};
  
