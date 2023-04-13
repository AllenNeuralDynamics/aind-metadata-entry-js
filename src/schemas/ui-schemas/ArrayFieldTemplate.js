const customArrayField = (props) => {
  const { items, schema, uiSchema } = props;
  const { displayNames } = uiSchema["ui:options"];
  return (
    <div>
      {items.map((element, index) => (
        <div key={index}>
          {displayNames[element] || element}
        </div>
      ))}
    </div>
  );
};

const uiSchema = {
  "modality": {
    "ui:field": customArrayField,
    "ui:options": {
      "displayNames": {
        [{
          "name": "Extracellular electrophysiology",
          "abbreviation": "ecephys"
        }]: "ecephys",
      }
    }
  }
};


export default uiSchema;