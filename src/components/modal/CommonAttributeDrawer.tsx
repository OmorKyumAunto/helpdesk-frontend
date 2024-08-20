import { Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { RootState } from '../../app/store/store';
import { setModal } from '../../app/slice/modalSlice';

type Props = {
  element: React.ReactElement;
  title: string;
  width?: string | number;
  open?: boolean;
};

const CommonAttributeDrawer = ({ element, title, width, open }: Props) => {
  const modalSlice = useSelector((state: RootState) => state.modalSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setModal(false));
    };
  }, [dispatch]);

  const handleCancel = () => {
    dispatch(setModal(false));
  };

  return (
    <Drawer
      title={title}
      bodyStyle={{ paddingBottom: 80 }}
      open={modalSlice.isModal && open}
      onClose={handleCancel}
      width={width || 720}
      // open={open}
    >
      {element}
    </Drawer>
  );
};

export default CommonAttributeDrawer;
