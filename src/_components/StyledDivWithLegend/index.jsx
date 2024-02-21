import React from 'react';
import './assets/css/index.css';

const StyledDivWithLegend = ({ header = 'Actions', children }) => {
  return (
    <div className='fieldset'>
      <h6
        className='legend'
        style={{ background: header === 'Table' && 'white' }}
      >
        {header}
      </h6>

      {children}
    </div>
  );
};

export default StyledDivWithLegend;
