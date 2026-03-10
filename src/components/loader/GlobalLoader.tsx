import React from 'react';
import Lottie from 'lottie-react';
import spinLoader from '../../assets/spinloader.json';

const ScreenLoader: React.FC = () => (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.9)',
      zIndex: 9999,
    }}
  >
    <Lottie 
      animationData={spinLoader}
      loop={true}
      autoplay={true}
      style={{ width: 200, height: 200 }}
    />
  </div>
);

export default ScreenLoader;