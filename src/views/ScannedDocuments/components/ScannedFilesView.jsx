import React, { useState, useEffect } from 'react';
import { Carousel, Card, Row, Image } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { scannedDocsService, plotService } from '../../../_services';

const ScannedFilesView = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (state && state.record && state.record.id) {
      previewFiles(state?.record.id);
    }
  }, [state]);

  const previewFiles = (id) => {
    setFiles([]);
    scannedDocsService.previewScan(id).then((resp) => {
    });
  };


  const onChange = (currentSlide) => {
  };
  return (
    <div id='content'>
      <Card
        title={
          <>
            <span>Files for</span>
            <span style={{ marginLeft: '6px', color: 'green' }}>
              #{state?.record?.plotNumber}
            </span>
          </>
        }
      >
        <Carousel afterChange={onChange}>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
      </Card>
    </div>
  );
};

const contentStyle = {
  // margin: 0,
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

export default ScannedFilesView;
