import React from 'react';
import { Skeleton } from 'antd';

const JournalInfoSkeleton = () => {
  return (
    <div style={{ width: '100%' }}>
      <Skeleton active />
    </div>
  );
};

export default JournalInfoSkeleton;
