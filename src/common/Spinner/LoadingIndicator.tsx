import { Row, Spin } from 'antd';
import styled, { keyframes } from 'styled-components';

const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const shape1 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(0, 18px);
  }
  50% {
    transform: translate(18px, 18px);
  }
  75% {
    transform: translate(18px, 0);
  }
}`;

const shape2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-18px, 0);
  }
  50% {
    transform: translate(-18px, 18px);
  }
  75% {
    transform: translate(0, 18px);
  }
}`;

const shape3 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(18px, 0);
  }
  50% {
    transform: translate(18px, -18px);
  }
  75% {
    transform: translate(0, -18px);
  }
}`;

const shape4 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(0, -18px);
  }
  50% {
    transform: translate(-18px, -18px);
  }
  75% {
    transform: translate(-18px, 0);
  }
}`;

const Container = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  animation: ${rotation} 1s infinite;
`;

const Shape = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 2px;
`;

const Shape1 = styled(Shape)`
  left: 0;
  background-color: #3c8dcf;
  animation: ${shape1} 2s linear infinite;
`;

const Shape2 = styled(Shape)`
  right: 0;
  background-color: #3c8dcf;
  animation: ${shape2} 2s linear infinite;
`;

const Shape3 = styled(Shape)`
  bottom: 0;
  background-color: #3c8dcf;
  animation: ${shape3} 2s linear infinite;
`;

const Shape4 = styled(Shape)`
  bottom: 0;
  right: 0;
  background-color: #3c8dcf;
  animation: ${shape4} 2s linear infinite;
`;

const Loading = () => {
  return (
    <Container>
      <Shape1 />
      <Shape2 />
      <Shape3 />
      <Shape4 />
    </Container>
  );
};

export const loadingIndicator = (
  <div
    className='loading_custom'
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <Loading />
  </div>
);
