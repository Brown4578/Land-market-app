import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Space, Button, Descriptions } from 'antd';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';

const MemberDetails = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [memberData, setMemberData] = useState(null);
  const [memberType, setMemberType] = useState(null);


  useEffect(() => {
    if (state && state.record) {
      setMemberData(state.record);
      setMemberType(state.record?.memberType ?? state?.memberType);
    } else {
      handleBack();
    }
  }, [state]);

  const handleBack = () => {
    navigate('/members-register', { state: { memberType: memberType } });
  };

  return (
    <div id='content'>
      <Card
        type='inner'
        title={
          <Space>
            <Button
              type='link'
              style={{ width: '15px' }}
              icon={<AiOutlineArrowLeft style={{ width: '100%' }} />}
              onClick={() => handleBack()}
            />
            <span>Member Details</span>
          </Space>
        }
      >
        {memberData && (
          <>
            <Descriptions
              bordered
              size='small'
              column={{
                xxl: 4,
                xl: 3,
                lg: 3,
                md: 2,
                sm: 1,
                xs: 1,
              }}
            >
              <Descriptions.Item label='Name'>
                {memberData?.firstName +
                  ' ' +
                  memberData?.secondName +
                  ' ' +
                  memberData?.surname}
              </Descriptions.Item>
              <Descriptions.Item label='Gender'>
                {memberData?.gender}
              </Descriptions.Item>

              <Descriptions.Item label='Tel. 1'>
                <a
                  style={{ textDecoration: 'none' }}
                  href={`tel:${memberData?.phoneNumber}`}
                >
                  {memberData?.phoneNumber}
                </a>
              </Descriptions.Item>
              {memberData.phoneNumber2 && (
                <Descriptions.Item label='Tel. 2'>
                  <a
                    style={{ textDecoration: 'none' }}
                    href={`tel:${memberData?.phoneNumber2}`}
                  >
                    {memberData?.phoneNumber2}
                  </a>
                </Descriptions.Item>
              )}
              <Descriptions.Item label='Email'>
                <a
                  style={{ textDecoration: 'none' }}
                  href={`mailto:${memberData?.emailAddress}`}
                >
                  {memberData?.emailAddress}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label='Home Address'>
                {memberData?.homeAddress}
              </Descriptions.Item>
              <Descriptions.Item label='County'>
                {memberData?.county}
              </Descriptions.Item>
              <Descriptions.Item label='Sub-county'>
                {memberData?.subCounty}
              </Descriptions.Item>
              <Descriptions.Item label='Division'>
                {memberData?.division}
              </Descriptions.Item>
              <Descriptions.Item label='Location'>
                {memberData?.location}
              </Descriptions.Item>
              <Descriptions.Item label='Sub-Location'>
                {memberData?.subLocation}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Card>
    </div>
  );
};

export default MemberDetails;
