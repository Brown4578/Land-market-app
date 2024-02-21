import React, { useEffect, useState } from 'react';
import { Descriptions, Card, Tabs, message, notification, Table } from 'antd';
import { journalService } from '../../../../../_services';
import { journalInfoColumns } from './jlistcolumns';

const { TabPane } = Tabs;

const JournalInfo = (props) => {
  const [journal, setJournal] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (props.id) {
      getJournalDetails(props.id);
    }
  }, [props.id]);

  const getJournalDetails = (params) => {
    journalService
      .getJournal(params)
      .then((res) => {
        setJournal(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          const { details } = err.response.data;
          notification.error({
            message: `Failed Loading`,
            description: `${details}`,
          });
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log('Error', err.message);
          message.error(`Error Loading: ${err.message}`);
        }
      });
  };

  const items = [
    {
      key: '1',
      label: 'Transactions',
      children: (
        <Table
          loading={isLoading}
          bordered
          dataSource={journal?.journalEntries || []}
          columns={journalInfoColumns}
          size='small'
          rowKey={(record) => record.id}
          pagination={false}
        />
      ),
    },
  ];

  return (
    <div>
      <Card type='inner' title={'Journal Details'}>
        <Descriptions column={2}>
          <Descriptions.Item label={'Journal Date'}>
            {journal?.date || null}
          </Descriptions.Item>
          <Descriptions.Item label={'Transaction No'}>
            {journal?.transaction_no || null}
          </Descriptions.Item>
          <Descriptions.Item label={'Amount'}>
            {journal?.amount || null}
          </Descriptions.Item>
          <Descriptions.Item label={'Status'}>
            {journal?.state || null}
          </Descriptions.Item>
          <Descriptions.Item label={'Created By'} span={2}>
            {journal?.created_by || null}
          </Descriptions.Item>
          <Descriptions.Item label={'Description'} span={2}>
            {journal?.description || null}
          </Descriptions.Item>
        </Descriptions>
        <Tabs defaultActiveKey='1' items={items} />
      </Card>
    </div>
  );
};

export default JournalInfo;
