import React from 'react';

  const ObjectFieldTemplate = ({ properties, description, title }) => {
    return (
      <div>
        <legend> {title} </legend>
        {description}
        <div className="row">
          {properties.map(prop => (
            <div
              className="col col-lg-2"
              key={prop.content.key}>
            {prop.content}
            </div>
          ))}
        </div>
      </div>
    );
  }

export default ObjectFieldTemplate;
