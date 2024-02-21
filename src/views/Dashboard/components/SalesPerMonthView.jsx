import React from 'react';
import { Line } from '@ant-design/plots';
import { Card } from 'antd';

export const SalesPerMonthView = ({ data = [], loading = true, ...props }) => {
  const config = {
    data,
    xField: 'label',
    yField: 'value',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  return (
    <Card size='small' loading={loading} title='Sales per Month'>
      <Line {...config} />
    </Card>
  );
};
