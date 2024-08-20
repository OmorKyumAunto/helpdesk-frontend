import { RootState, useAppSelector } from '../app/store/store';

const useAccessToken = () => {
  return useAppSelector((state: RootState) => state.userSlice.token);
};

export default useAccessToken;