import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../app/store/store";
import { setCommonModal } from "../../app/slice/modalSlice";

const CommonModal = () => {
  const { title, show, content, width } = useSelector(
    (state: RootState) => state.modalSlice
  );

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setCommonModal());
    };
  }, [dispatch]);

  const handleCancel = () => {
    dispatch(setCommonModal());
  };

  return (
    <Modal
      title={title}
      open={show}
      onCancel={handleCancel}
      footer={false}
      width={width}
    >
      {content}
    </Modal>
  );
};

export default CommonModal;
