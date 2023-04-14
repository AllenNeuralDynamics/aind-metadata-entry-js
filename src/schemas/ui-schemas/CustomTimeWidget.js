import React from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';

const CustomTimeWidget = (props) => {
    const onChange = (selectedDate) => {
        const formattedTime = moment(selectedDate).format('HH:mm:ss');
        props.onChange(formattedTime);
      };
  return (
    <Datetime
      dateFormat={false}
      timeFormat="HH:mm:ss"
      value={props.value ? moment(props.value, 'HH:mm:ss') : undefined}
      onChange={onChange}
    />
  );
};


export default CustomTimeWidget;
