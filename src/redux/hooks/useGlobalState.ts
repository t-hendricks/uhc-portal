import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { GlobalState } from '../types';

export const useGlobalState: TypedUseSelectorHook<GlobalState> = useSelector;
