import React from 'react';
import { Column } from '@ant-design/plots';
import { Card, Skeleton, Tooltip } from 'antd';

export const CustomBarGraph = ({ data = [], loading = true,title="", ...props }) => {
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

  const EnhancedColumn = ({ data, xField, yField, ...otherProps }) => {
    return (
      <Tooltip
        title={
          <div>
            {data.map((item) => (
              <p key={item.label}>
                {item.label}: {item.value}
              </p>
            ))}
          </div>
        }
      >
        <Column data={data} xField={xField} yField={yField} {...otherProps} />
      </Tooltip>
    );
  };

  return (
    <Card size='small' loading={loading} title={title}>
      {loading ? (
        <Skeleton height={200} /> // Display a placeholder while loading
      ) : (
        <EnhancedColumn {...config} />
      )}
    </Card>
  );
};
