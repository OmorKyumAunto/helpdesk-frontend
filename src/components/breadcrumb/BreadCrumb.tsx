import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const BreadCrumb = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((item) => item);
  const capitalize = (s: any) => s.charAt(0).toUpperCase() + s.slice(1);
   
 
  return (
    <div style={{ paddingBottom: '5px'}}>
      <Breadcrumb
        items={[
          {
            title: (
              <Link to='/'>
                <HomeOutlined />
              </Link>
            ),
          },
          ...pathnames.map((item, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            if (isLast) {
              return {
                title: capitalize(item),
              };
            }
            return {
              title: <Link to={`${routeTo}`}>{capitalize(item)}</Link>,
            };
          }),
        ]}
      />
    </div>
  );
};

export default BreadCrumb;
