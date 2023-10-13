import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useGlobalState } from '~/redux/hooks';
import { getMachineTypes } from '~/redux/actions/machineTypesActions';

const useMachineTypes = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getMachineTypes());
  }, [dispatch]);

  const machineTypesResponse = useGlobalState((state) => state.machineTypes);
  return machineTypesResponse;
};

export default useMachineTypes;
