import { Button } from 'antd';
import { AiOutlinePlus } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const AddButton = ({ text = '', size = 'default', url = null }) => {
  const navigate = useNavigate();

  return (
    <Button
      size={size}
      icon={<AiOutlinePlus style={{ marginTop: '-2.5px' }} />}
      className='custom-btn-add-style'
      onClick={() => navigate({ pathname: url })}
      type='primary'
      ghost
    >
      {text}
    </Button>
  );
};
