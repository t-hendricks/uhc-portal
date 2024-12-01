import React from 'react';
import { Formik } from 'formik';

import { FieldId } from '~/components/clusters/wizards/common';
import { useFormState } from '~/components/clusters/wizards/hooks/useFormState';
import { useDisableClusterAutoscaler } from '~/queries/ClusterDetailsQueries/MachinePoolTab/ClusterAutoscaler/useDisableClusterAutoscaler';
import { useEnableClusterAutoscaler } from '~/queries/ClusterDetailsQueries/MachinePoolTab/ClusterAutoscaler/useEnableClusterAutoscaler';
import { checkAccessibility, render, screen, userEvent } from '~/testUtils';

import { clusterAutoscalerData } from './ClusterAutoscaler.fixtures';
import { ClusterAutoscalerModal } from './ClusterAutoscalerModal';

jest.mock('~/components/clusters/wizards/hooks/useFormState');

jest.mock(
  '~/queries/ClusterDetailsQueries/MachinePoolTab/ClusterAutoscaler/useDisableClusterAutoscaler',
  () => ({
    useDisableClusterAutoscaler: jest.fn(() => ({
      data: undefined,
      mutate: jest.fn(),
      isPending: false,
    })),
  }),
);
jest.mock(
  '~/queries/ClusterDetailsQueries/MachinePoolTab/ClusterAutoscaler/useEnableClusterAutoscaler',
  () => ({
    useEnableClusterAutoscaler: jest.fn(() => ({
      data: undefined,
      mutate: jest.fn(),
      isPending: false,
    })),
  }),
);

const initalPropsWithoutAutoscalingMachinePools = {
  submitForm: jest.fn(),
  isUpdateClusterAutoscalerPending: false,
  clusterId: '123CLUSTERID',
  hasClusterAutoscaler: true,
  isRosa: true,
  isOpen: true,
  isWizard: false,
  dirty: false,
  hasAutoscalingMachinePools: false,
  isClusterAutoscalerRefetching: false,
  maxNodesTotalDefault: 180,
};

const dirtyForm = {
  ...initalPropsWithoutAutoscalingMachinePools,
  dirty: true,
};

describe('Cluster autoscaler modal', () => {
  const mockedUseFormState = useFormState as jest.Mock;
  mockedUseFormState.mockReturnValue({
    values: { [FieldId.ClusterAutoscaling]: { ...clusterAutoscalerData } },
    errors: { [FieldId.ClusterAutoscaling]: 'Error message' },
    setFieldValue: jest.fn(),
  });

  const useDisableClusterAutoscalerMock = useDisableClusterAutoscaler as jest.Mock;
  const useEnableClusterAutoscalerMock = useEnableClusterAutoscaler as jest.Mock;
  it('is accessible', async () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <ClusterAutoscalerModal {...initalPropsWithoutAutoscalingMachinePools} />
      </Formik>,
    );

    await checkAccessibility(container);
  });

  it("won't autscale because no machine pools with autoscaling warning", () => {
    render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <ClusterAutoscalerModal {...initalPropsWithoutAutoscalingMachinePools} />
      </Formik>,
    );

    expect(
      screen.getByText(
        /The cluster autoscaling settings will not have any effect as no machine pools are set to autoscale./i,
      ),
    ).toBeInTheDocument();
  });

  it('Changing default value results in save button', async () => {
    const { rerender } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <ClusterAutoscalerModal {...initalPropsWithoutAutoscalingMachinePools} />
      </Formik>,
    );

    const inputElement = screen.getByRole('textbox', { name: /max-node-provision-time/i });
    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, '18m');

    rerender(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <ClusterAutoscalerModal {...dirtyForm} />
      </Formik>,
    );

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('Switch cluster autoscaler off', async () => {
    const mutateDisableMock = jest.fn();

    useDisableClusterAutoscalerMock.mockReturnValue({
      isPending: false,
      mutate: mutateDisableMock,
    });

    render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <ClusterAutoscalerModal {...initalPropsWithoutAutoscalingMachinePools} />
      </Formik>,
    );

    const clusterSwitch = screen.getByRole('checkbox', { name: /Autoscale cluster/i });

    await userEvent.click(clusterSwitch);

    expect(mutateDisableMock).toHaveBeenCalled();
  });

  it('Switch cluster autoscaler on', async () => {
    const mutateEnableMock = jest.fn();
    useEnableClusterAutoscalerMock.mockReturnValue({
      isPeding: false,
      mutate: mutateEnableMock,
    });

    render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <ClusterAutoscalerModal
          {...initalPropsWithoutAutoscalingMachinePools}
          hasClusterAutoscaler={false}
        />
      </Formik>,
    );

    const clusterSwitch = screen.getByRole('checkbox', { name: /Autoscale cluster/i });

    await userEvent.click(clusterSwitch);
    expect(mutateEnableMock).toHaveBeenCalled();
  });
});
