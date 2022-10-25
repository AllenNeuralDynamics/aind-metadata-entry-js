import React from 'react';
import {Container} from 'react-bootstrap';

const MuiGridLayoutTemplate = (props) => {
    return <Container
      container
      direction="column"
      justify="space-between"
      alignItems="center"
    >
      {props.uiSchema['ui:grid'].map(row =>
        <Container
          item
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          spacing={4}
        >
          {Object.keys(row).map(fieldName =>
          <Container item xs={row[fieldName]}>
            {props.properties.find(p=>p.name===fieldName).content}
          </Container>)}
        </Container>)}
    </Container>
  }

  const ObjectFieldTemplate = ({ TitleField, properties, title, description }) => {
    console.log(properties)
    return (
      <div>
        <TitleField title={title} />
        <div className="row">
          {properties.map(prop => (
            <div
              className="col-lg-2 col-md-4 col-sm-6 col-xs-12"
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
  