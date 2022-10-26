import React from 'react';

  const ObjectFieldTemplate = ({ TitleField, properties, title, description }) => {
    // TODO: overwrite direction display 
    //TODO: throw error if coords are entered incorrectly (ex: [ML,ML,ML])
    return (
      <div>
        <TitleField title={title} />
        <div className="row">
          {properties.map(prop => (
            <div
              className="col col-lg-2"
              key={prop.content.key}>
            {prop.content}
            </div>
          ))}
        </div>
        {description}
      </div>
    );
  }

  export default ObjectFieldTemplate;
  