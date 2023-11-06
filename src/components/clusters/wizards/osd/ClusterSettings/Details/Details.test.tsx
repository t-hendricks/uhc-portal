import * as React from 'react';
import { Formik } from 'formik';

import { screen, withState } from '~/testUtils';
import { FieldId, initialValues } from '../../constants';
import { Details } from './Details';

describe('<Details />', () => {
  const defaultValues = {
    ...initialValues,
    [FieldId.Region]: 'eu-north-1',
  };

  describe('Region dropdown', () => {
    it('displays a spinner while regions are loading', () => {
      const loadedState = {
        cloudProviders: {
          fulfilled: false,
          pending: true,
          error: false,
        },
      };

      withState(loadedState).render(
        <Formik initialValues={defaultValues} onSubmit={() => {}}>
          <Details />
        </Formik>,
      );
      expect(screen.queryByText('Loading region list...')).toBeInTheDocument();
    });

    it('displays the available regions when they are loaded', () => {
      const loadedState = {
        cloudProviders: {
          fulfilled: true,
          error: false,
          providers: {
            aws: {
              regions: [
                { id: 'eu-north-1', display_name: 'EU, Stockholm', ccs_only: false, enabled: true },
                {
                  id: 'us-west-2',
                  display_name: 'US West, Oregon',
                  ccs_only: false,
                  enabled: true,
                },
              ],
            },
          },
        },
      };

      withState(loadedState).render(
        <Formik initialValues={defaultValues} onSubmit={() => {}}>
          <Details />
        </Formik>,
      );

      expect(screen.queryByText('eu-north-1, EU, Stockholm')).toBeInTheDocument();
      expect(screen.queryByText('us-west-2, US West, Oregon')).toBeInTheDocument();
    });
  });
});
