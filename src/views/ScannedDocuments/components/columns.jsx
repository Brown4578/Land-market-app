import { Typography } from 'antd';

const { Paragraph } = Typography;

export const scannedDocsColumns = [
  {
    title: 'Member',
    dataIndex: 'memberName',
    key: 'memberName',
  },
  {
    title: 'Block',
    dataIndex: 'blockName',
    key: 'blockName',
  },
  {
    title: 'Phase',
    dataIndex: 'phaseName',
    key: 'phaseName',
  },
  {
    title: 'Plot No.',
    dataIndex: 'plotNumber',
    key: 'plotNumber',
  },
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    render: (text) => (
      <Paragraph
        copyable={{
          tooltips: true,
        }}
      >
        {text}
      </Paragraph>
    ),
  },
];
