import { Avatar, Card, Col, List, Row } from 'antd';
import { Link } from 'react-router-dom';
import { AiOutlineAppstore } from 'react-icons/ai';
import { FaRegBuilding } from 'react-icons/fa';
import { RiLinkM } from 'react-icons/ri';

const first_row = [
  {
    title: 'Manage Parameters',
    description: 'Parameters are used to define drop down values',
    icon: (
      <AiOutlineAppstore
        style={{
          color: 'green',
        }}
      />
    ),
    url: '/system-settings/parameters',
  },
  {
    title: 'Company Details',
    description: 'Manage company details',
    icon: (
      <FaRegBuilding
        style={{
          color: 'purple',
        }}
      />
    ),
    url: '/system-settings/company',
  },
  {
    title: 'Account Interface',
    description: 'Manage account interface details',
    icon: (
      <RiLinkM
        style={{
          color: 'orange',
        }}
      />
    ),
    url: '/system-settings/accounts-interface',
  },
];

const Settings = () => {
  return (
    <div id='content'>
      <Card title='Settings'>
        <Row gutter={16}>
          <Col span={24}>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              itemLayout='horizontal'
              dataSource={first_row}
              size='small'
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Link style={{ textDecoration: 'none' }} to={item.url}>
                        <Avatar
                          icon={item.icon}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        />
                      </Link>
                    }
                    title={
                      <Link style={{ textDecoration: 'none' }} to={item.url}>
                        {item.title}
                      </Link>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Settings;
