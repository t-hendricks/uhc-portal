import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { GlobalState } from '../store';

export const useGlobalState: TypedUseSelectorHook<GlobalState> = useSelector;
