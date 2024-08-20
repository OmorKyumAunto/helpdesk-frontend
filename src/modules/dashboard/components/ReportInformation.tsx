import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

import { Link } from 'react-router-dom';
import {
  AuditOutlined,
  ControlOutlined,
  SnippetsOutlined,
} from '@ant-design/icons';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ReportInformation = () => {
  const { Title } = Typography;
  const dummyData = [
    { accountName: 'NexCap', lastBalance: '$1000' },
    { accountName: 'Global360', lastBalance: '$2500' },
    { accountName: 'M360-ICT', lastBalance: '$500' },
  ];
  const dummyData2 = [
    { accountName: 'Nasum', lastBalance: '$1000' },
    { accountName: 'Fizz', lastBalance: '$2500' },
    { accountName: 'Lionel Messi', lastBalance: '$500' },
  ];
  const data01 = [
    { x: 160, y: 50, z: 80 },
    { x: 155, y: 55, z: 90 },
    { x: 170, y: 60, z: 95 },
    { x: 165, y: 65, z: 70 },
    { x: 180, y: 70, z: 60 },
    { x: 175, y: 75, z: 85 },
    { x: 15, y: 75, z: 85 },
    { x: 75, y: 75, z: 85 },
  ];

  const data02 = [
    { x: 50, y: 45, z: 0 },
    { x: 45, y: 50, z: 80 },
    { x: 60, y: 55, z: 5 },
    { x: 15, y: 60, z: 75 },
    { x: 10, y: 65, z: 90 },
    { x: 15, y: 70, z: 60 },
    { x: 15, y: 70, z: 60 },
    { x: 159, y: 170, z: 60 },
  ];
  return (
    <>
      <Row gutter={[24, 5]}>
        <Col xs={24} xl={9}>
          <Card
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,.05)',
              marginBottom: '1rem',
            }}
          >
            <Link to={'reports/ledger/account-ledger'}>
              <Title
                level={5}
                style={{
                  lineHeight: '1.5',
                  letterSpacing: '0.00938em',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                  marginBottom: '15px',
                }}
              >
                <SnippetsOutlined style={{ marginRight: '7px' }} /> Account
                Report
              </Title>
            </Link>
            <Row gutter={[16, 16]}>
              {dummyData.map((data, index) => (
                <Col xs={24} key={index}>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '16px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p>{data.accountName}</p>
                    <p>Last Balance: {data.lastBalance}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} xl={9}>
          <Card
            style={{
              boxShadow: '0 0 0 1px rgba(0,0,0,.05)',
              marginBottom: '1rem',
            }}
          >
            <Link to={'reports/ledger/supplier-ledger'}>
              <Title
                level={5}
                style={{
                  lineHeight: '1.5',
                  letterSpacing: '0.00938em',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                  marginBottom: '15px',
                }}
              >
                <AuditOutlined style={{ marginRight: '7px' }} /> Supplier Report
              </Title>
            </Link>
            <Row gutter={[16, 16]}>
              {dummyData2.map((data, index) => (
                <Col xs={24} key={index}>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '16px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p>{data.accountName}</p>
                    <p>Last Balance: {data.lastBalance}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8} xl={6}>
          <Card>
            <Link to={'reports/ledger/supplier-ledger'}>
              <Title
                level={5}
                style={{
                  lineHeight: '1.5',
                  letterSpacing: '0.00938em',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                  marginBottom: '2rem',
                }}
              >
                <ControlOutlined /> Review Data
              </Title>
            </Link>

            <ResponsiveContainer height={100}>
              <PieChart width={100} height={100}>
                <Pie
                  data={data}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={50}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ReportInformation;
