import React from 'react';

export const blockColumns = [
  {
    title: 'Block Name',
    dataIndex: 'blockName',
    key: 'blockName',
    render: (text) => <>{text ? convertToLowerThenCapitalize(text) : '-'}</>,
  },
  {
    title: 'County',
    dataIndex: 'county',
    key: 'county',
    render: (text) => <>{text ? convertToLowerThenCapitalize(text) : '-'}</>,
  },
  {
    title: 'Sub County',
    dataIndex: 'subCounty',
    key: 'subCounty',
    render: (text) => <>{text ? convertToLowerThenCapitalize(text) : '-'}</>,
  },
  {
    title: 'Division',
    dataIndex: 'division',
    key: 'division',
    render: (text) => <>{text ? convertToLowerThenCapitalize(text) : '-'}</>,
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    render: (text) => <>{text ? convertToLowerThenCapitalize(text) : '-'}</>,
  },
];

const convertToLowerThenCapitalize = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => {
      return word[0]?.toUpperCase() + word.slice(1);
    })
    .join(' ');
};
