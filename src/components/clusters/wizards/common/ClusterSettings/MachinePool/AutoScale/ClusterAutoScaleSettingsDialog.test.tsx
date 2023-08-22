import React from 'react';
import { Formik } from 'formik';
import merge from 'lodash/merge';

import { checkAccessibility, render, screen, userEvent, UserEventType } from '~/testUtils';
import modals from '~/components/common/Modal/modals';
import { ClusterAutoscaler } from '~/types/clusters_mgmt.v1';
import { FieldId } from '~/components/clusters/wizards/common';

import { getDefaultClusterAutoScaling } from '~/components/clusters/CreateOSDPage/clusterAutoScalingValues';
import ClusterAutoScaleSettingsDialog from './ClusterAutoScaleSettingsDialog';

const defaultState = {
  modal: {
    modalName: modals.EDIT_CLUSTER_AUTOSCALING_V2,
  },
};

const testInputFieldId = 'cluster_autoscaling.scale_down.utilization_threshold';
const getTestInputField = () => document.getElementById(testInputFieldId) as HTMLElement; // no other selector is available for the Input fields
const getModalActionButton = (name: string) => screen.getByRole('button', { name });

const updateTestInputValue = async (
  user: UserEventType,
  { typeValue, clearBefore }: { typeValue: string; clearBefore: boolean },
) => {
  const field = getTestInputField();
  if (clearBefore) {
    await user.clear(field);
  }
  await user.type(field, typeValue, { initialSelectionStart: 0 });
};

// We need to wrap the component in Formik so that the context resolves correctly.
// We are not interested on submit at the form level, as the component being tested is only a subpart
const buildTestComponent = (values?: Partial<ClusterAutoscaler>) => {
  const autoScalingValues = merge({}, getDefaultClusterAutoScaling(), values);
  return (
    <Formik
      initialValues={{
        [FieldId.ClusterAutoscaling]: autoScalingValues,
      }}
      initialTouched={{ [testInputFieldId]: true }} // so that it shows the errors if it's invalid initially
      onSubmit={() => {}}
    >
      <ClusterAutoScaleSettingsDialog isWizard />
    </Formik>
  );
};

describe('<ClusterAutoScaleSettingsDialog />', () => {
  it('is accessible', async () => {
    // Arrange
    const { container } = render(buildTestComponent(), {}, defaultState);

    // Assert
    await checkAccessibility(container);
  });

  describe('Field values', () => {
    it('enables autoScaling fields when scaleDown is enabled', async () => {
      // Arrange
      render(buildTestComponent(), {}, defaultState);

      // Assert
      const scaleDownField = getTestInputField();
      expect(scaleDownField).toBeEnabled();
    });

    it('disables autoScaling fields when scaleDown is disabled', async () => {
      // Arrange
      render(
        buildTestComponent({
          scale_down: {
            enabled: false,
          },
        }),
        {},
        defaultState,
      );

      // Assert
      const scaleDownField = getTestInputField();
      expect(scaleDownField).toBeDisabled();
    });

    it('shows the correct boolean values in the boolean select component', async () => {
      // Arrange
      render(buildTestComponent(), {}, defaultState);

      // Assert
      const booleanDropdownButtons = screen.getAllByRole('button', { expanded: false });
      expect(booleanDropdownButtons[0]).toHaveTextContent('false'); // for the balance_similar_node_groups field
      expect(booleanDropdownButtons[1]).toHaveTextContent('true'); // for the skip_nodes_with_local_storage field
    });
  });

  describe('Modal Buttons', () => {
    it('"Close" becomes disabled when some field has errors', async () => {
      // Arrange
      const user = userEvent.setup();
      render(buildTestComponent(), {}, defaultState);
      expect(getModalActionButton('Close')).toBeEnabled();
      expect(getTestInputField()).toHaveValue(0.5);

      // Act
      await updateTestInputValue(user, { typeValue: '44', clearBefore: false });

      // Assert
      expect(getTestInputField()).toHaveValue(440.5); // It's a range between 0 and 1
      expect(getModalActionButton('Close')).toBeDisabled();
    });

    it('"Close" button becomes enabled when the error is fixed', async () => {
      // Arrange
      const user = userEvent.setup();
      render(buildTestComponent(), {}, defaultState);

      // Act - first get the component in an error state and fix it
      await updateTestInputValue(user, { typeValue: '11', clearBefore: true });
      expect(getModalActionButton('Close')).toBeDisabled();
      await updateTestInputValue(user, { typeValue: '0.33', clearBefore: true });

      // Assert
      expect(getModalActionButton('Close')).toBeEnabled();
    });
  });
});
