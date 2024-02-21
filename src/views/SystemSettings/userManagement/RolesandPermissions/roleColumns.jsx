import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Button } from 'antd';

export const RoleColumns = [
 
  {
    title: 'Status',
    dataIndex: 'disabled',
    key: 'disabled',
    width: '10%',
    render: (text, row) =>
      text === true ? (
        <Tag color='red'>Inactive</Tag>
      ) : (
        <Tag color='blue'>Active</Tag>
      ),
  },
  
];
