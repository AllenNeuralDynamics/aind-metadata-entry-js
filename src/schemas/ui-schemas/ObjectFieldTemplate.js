import React from 'react';

  const ObjectFieldTemplate = ({ TitleField, properties, title, description }) => {
    /*const direction = properties[0]
    const value = properties[1]
    return (
      <div>
        <TitleField title={title} />
        <div className="container">
        <div className="row">
          <div className="col-6"
          key={direction.content.key}>
          </div>
          {direction.content}
          <div className="col-6"
          key={value.content.key}>
          </div>
          {value.content}
        </div>
        </div>
      </div>
    )*/
    // TODO: overwrite direction display
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
  