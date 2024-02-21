import React, { useState } from 'react';
import { Upload } from 'antd';
import {
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { Row, Col } from 'antd';
import { toast } from 'react-toastify';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if (!isJpgOrPng) {
    toast.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    toast.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const Avatar = (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        setImageUrl(imageUrl);
        props.fileToSave(info.file.originFileObj);
      });
    }
  };

  // In order to proceed the dummy request is required
  // It prevents the upload component from calling any API endpoints
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <Row>
      <Col className='d-flex justify-content-start'>
        {/* <ImgCrop
          rotationSlider
          quality='1'
          objectFit='cover'
          cropSize={{ width: '100%', height: '100%' }}
        > */}
        <Upload
          name='avatar'
          listType='picture-card'
          className='avatar-uploader'
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={dummyRequest}
          onChange={handleChange}
          onPreview={onPreview}
        >
          {imageUrl ? (
            <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
        {/* </ImgCrop> */}
        {imageUrl && (
          <DeleteOutlined
            style={{ cursor: 'pointer', color: 'red' }}
            onClick={() => {
              setImageUrl(null);
              props.fileToSave(null);
            }}
          />
        )}
      </Col>
    </Row>
  );
};

export default Avatar;
