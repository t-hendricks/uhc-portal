import * as React from 'react';
import { insightsMock, render, screen, within } from '~/testUtils';
import EditMachinePoolModal from './EditMachinePoolModal';

insightsMock();

describe('<EditMachinePoolModal />', () => {
  describe('error state', () => {
    it('Shows alert if machine pools failed to load', () => {
      render(
        <EditMachinePoolModal
          cluster={{}}
          onClose={() => {}}
          machinePoolsResponse={{
            error: true,
            fulfilled: false,
            pending: false,
            errorCode: 400,
            errorMessage: 'foo err',
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
        />,
      );
      expect(
        screen.getByRole('alert', {
          name: /danger alert/i,
        }),
      ).toBeInTheDocument();

      expect(screen.getByTestId('submit-btn')).toBeDisabled();
      expect(screen.getByTestId('cancel-btn')).toBeEnabled();
    });

    it('Shows alert if machine types failed to load', () => {
      render(
        <EditMachinePoolModal
          cluster={{}}
          onClose={() => {}}
          machinePoolsResponse={{
            error: true,
            fulfilled: false,
            pending: false,
            errorCode: 400,
            errorMessage: 'foo err',
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
        />,
      );
      expect(
        screen.getByRole('alert', {
          name: /danger alert/i,
        }),
      ).toBeInTheDocument();

      expect(screen.getByTestId('submit-btn')).toBeDisabled();
      expect(screen.getByTestId('cancel-btn')).toBeEnabled();
    });
  });

  describe('loading state', () => {
    const check = () => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByTestId('submit-btn')).toBeDisabled();
      expect(screen.getByTestId('cancel-btn')).toBeEnabled();
    };

    it('Shows loading if machine pools are loading', () => {
      render(
        <EditMachinePoolModal
          cluster={{}}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: false,
            pending: false,
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
        />,
      );
      check();
    });

    it('Shows loading if machine types are loading', () => {
      render(
        <EditMachinePoolModal
          cluster={{}}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: false,
          }}
        />,
      );
      check();
    });
  });

  describe('add machine pool', () => {
    it('Submit button shows `Add machine pool`', () => {
      render(
        <EditMachinePoolModal
          cluster={{}}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
        />,
      );
      const { getByText } = within(screen.getByTestId('submit-btn'));
      expect(getByText('Add machine pool')).toBeInTheDocument();
    });
  });

  describe('edit machine pool', () => {
    it('Submit button shows `Save`', () => {
      const { rerender } = render(
        <EditMachinePoolModal
          cluster={{}}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
          isEdit
        />,
      );
      const { getByText } = within(screen.getByTestId('submit-btn'));
      expect(getByText('Save')).toBeInTheDocument();

      rerender(
        <EditMachinePoolModal
          cluster={{}}
          onClose={() => {}}
          machinePoolsResponse={{
            error: false,
            fulfilled: true,
            pending: false,
            data: [],
          }}
          machineTypesResponse={{
            error: false,
            pending: false,
            fulfilled: true,
            types: {},
            typesByID: {},
          }}
          machinePoolId="foo"
        />,
      );

      const { getByText: getByText2 } = within(screen.getByTestId('submit-btn'));
      expect(getByText2('Save')).toBeInTheDocument();
    });
  });
});
