import React from 'react';
import { Card } from 'antd';
import StatementView from '../../Accounting/common/StatementView';

const MemberStatement = () => {
  return (
    <div id='content'>
      <Card id='content' size='small' title='Member Statements' type='inner'>
        <StatementView fromMemberStatement={true} showActions={false} />
      </Card>
    </div>
  );
};

export default MemberStatement;
