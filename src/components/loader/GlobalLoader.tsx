import React from 'react';
import { Spin } from 'antd';

const GlobalLoader: React.FC = () => (
  <div className="g_loading">
    <div className="spinner-container">
      <Spin />
    </div>
  </div>
);

export default GlobalLoader;