import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store/store';

export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
