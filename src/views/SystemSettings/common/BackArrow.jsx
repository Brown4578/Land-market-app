import { MdArrowBack } from 'react-icons/md';
import { Button } from 'antd';

import { useNavigate } from 'react-router-dom';

export const BackArrow = () => {
  const navigate = useNavigate();
  return (
    <Button
      type='link'
      icon={<MdArrowBack />}
      onClick={() => navigate(-1)}
      style={{ fontSize: 'inherit' }}
    />
  );
};
