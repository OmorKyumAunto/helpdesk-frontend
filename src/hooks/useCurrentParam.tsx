import { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useCurrentParam = () => {
  const { pathname } = useLocation();
  const [currentSelection, setCurrentSelection] = useState<string>(pathname);
  useEffect(() => {
    if (pathname && currentSelection !== pathname) {
      setCurrentSelection(pathname);
    }
  }, [pathname, currentSelection]);

  const handleClick: MenuProps['onClick'] = (e) => {
    setCurrentSelection(e.key);
  };

  return { currentSelection, handleClick };
};

export default useCurrentParam;
