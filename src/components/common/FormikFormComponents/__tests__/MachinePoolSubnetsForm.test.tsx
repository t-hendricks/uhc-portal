import React from 'react';
import * as formik from 'formik';
import { Formik } from 'formik';

import { FieldId } from '~/components/clusters/wizards/common/constants';
import * as utils from '~/components/clusters/wizards/form/utils';
import { checkAccessibility, screen, waitFor, withState } from '~/testUtils';

import MachinePoolSubnetsForm from '../MachinePoolSubnetsForm';

import { repeatedSubnets } from './MachinePoolSubnetsForm.fixtures';

describe('<MachinePoolSubnetsForm />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const defaultProps = { selectedVPC: {} };

  describe('it is accessible', () => {
    it('no content', async () => {
      // Act
      const { container } = withState({}).render(
        <Formik
          initialValues={{
            [FieldId.MachinePoolsSubnets]: [],
          }}
          onSubmit={() => {}}
        >
          <MachinePoolSubnetsForm {...defaultProps} />
        </Formik>,
      );

      // Assert
      await checkAccessibility(container);
    });

    it('with content', async () => {
      // Act
      const { container } = withState({}).render(
        <Formik
          initialValues={{
            [FieldId.MachinePoolsSubnets]: repeatedSubnets,
          }}
          onSubmit={() => {}}
        >
          <MachinePoolSubnetsForm {...defaultProps} />
        </Formik>,
      );

      // Assert
      await waitFor(() => checkAccessibility(container));
    });
  });

  describe('check validation', () => {
    it('changes machine pools subnets on removal', async () => {
      // Arrange
      const setNestedObjectValuesSpy = jest.spyOn(formik, 'setNestedObjectValues');
      const getScrollErrorIdsSpy = jest.spyOn(utils, 'getScrollErrorIds');
      const expectedErrors = [
        {
          machinePoolsSubnets: [
            undefined,
            {
              privateSubnetId: 'Every machine pool must be associated to a different subnet',
            },
            {
              privateSubnetId: 'Every machine pool must be associated to a different subnet',
            },
          ],
        },
        {
          machinePoolsSubnets: [
            {
              privateSubnetId: 'Subnet is required',
            },
            {
              privateSubnetId: 'Subnet is required',
            },
            {
              privateSubnetId: 'Subnet is required',
            },
          ],
        },
      ];

      const { user } = withState({}).render(
        <Formik
          initialValues={{
            [FieldId.MachinePoolsSubnets]: repeatedSubnets,
          }}
          onSubmit={() => {}}
        >
          <MachinePoolSubnetsForm {...defaultProps} />
        </Formik>,
      );

      // Act
      await user.click(screen.getByTestId('remove-machine-pool-2'));

      // Assert
      expect(setNestedObjectValuesSpy).toHaveBeenCalledTimes(3);
      expect(setNestedObjectValuesSpy).toHaveBeenCalledWith(expectedErrors[0], true);
      expect(setNestedObjectValuesSpy).toHaveBeenCalledWith(expectedErrors[1], true);

      expect(getScrollErrorIdsSpy).toHaveBeenCalledTimes(3);
      expect(getScrollErrorIdsSpy).toHaveBeenCalledWith(expectedErrors[0]);
      expect(getScrollErrorIdsSpy).toHaveBeenCalledWith(expectedErrors[1]);
    });
  });
});
