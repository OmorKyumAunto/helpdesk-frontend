import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

function LiveTime() {
  const [dateState, setDateState] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateState(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const dayName = dateState.toLocaleDateString('en-GB', { weekday: 'long' });
  const formattedDate = dateState.toLocaleDateString(
    'en-GB',
    options as Intl.DateTimeFormatOptions
  );

  const formattedTime = dateState.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CalendarOutlined />
      <p
        style={{
          marginRight: '10px',
          marginLeft: '5px',
          color: '#2298F1',
          fontWeight: '700',
        }}
      >
        {dayName}, {formattedDate}
      </p>
      <ClockCircleOutlined />
      <p style={{ marginLeft: '5px', color: '#2298F1', fontWeight: '700' }}>
        {formattedTime}
      </p>
    </div>
  );
}

export default LiveTime;
