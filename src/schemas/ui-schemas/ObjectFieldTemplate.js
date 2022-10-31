import React from 'react';

  const ObjectFieldTemplate = ({ properties, description }) => {
    return (
      <div>
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

  