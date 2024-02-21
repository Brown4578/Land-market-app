import React from 'react';
import { Card, Statistic } from 'antd';
import { generateColor } from '../../../_helpers/utils/StringManipulator';

export const CardView = ({
  title = '',
  value = '',
  hasPrefix = false,
  loading = true,
  hadPrecision = true,
}) => {
  return (
    <>
      <div
        size='small'
        style={{
          ...cardStyles,
          height: '71px',
          margin: 0,
          padding: '5px 10px',
        }}
      >
        <Statistic
          title={<b>{title}</b>}
          value={value}
          precision={hadPrecision ? 2 : 0}
          valueStyle={{
            color: generateColor(title),
          }}
          size='small'
          prefix={hasPrefix && 'KES'}
        />
      </div>
    </>
  );
};

const cardStyles = {
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease',
  ':hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)', // Hover effect
  },
  cursor: 'pointer',
};
