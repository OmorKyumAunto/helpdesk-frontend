import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Row, theme, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { setModal } from '../../app/slice/modalSlice';
import BreadCrumb from '../breadcrumb/BreadCrumb';

type IProps = { title: string; showButton: boolean };

const PageTitle = ({ title, showButton }: IProps) => {
  const dispatch = useDispatch();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  return (
    <>
      <Row
        align={'middle'}
        justify={'space-between'}
        style={{ marginBottom: '1rem' }}
      >
        <Typography.Title level={4}>{title}</Typography.Title>
        <BreadCrumb />
      </Row>
      <Card
        style={{
          boxShadow: '0 0 0 1px rgba(0,0,0,.05)',
          marginBottom: '1rem',
        }}
      >
        <Row align={'middle'} justify={'space-between'}>
          <Typography.Title level={3} style={{ color: colorPrimary }}>
            {title}
          </Typography.Title>
          {showButton && (
            <Button
              onClick={() => dispatch(setModal(true))}
              icon={<PlusOutlined />}
              size='large'
              type='primary'
            >{`Add ${title}`}</Button>
          )}
        </Row>
      </Card>
    </>
  );
};

export default PageTitle;
