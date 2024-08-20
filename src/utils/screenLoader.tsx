import React from 'react';
import { Spin } from 'antd';

const ScreenLoader: React.FC = () => (
  <div className="g_loading">
    <div className="spinner-container">
      <Spin />
    </div>
  </div>
);

export default ScreenLoader;