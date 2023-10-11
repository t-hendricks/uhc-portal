import * as React from 'react';
import { Formik } from 'formik';

import { render, screen } from '~/testUtils';
import { MarketplaceSelectField } from './MarketplaceSelectField';
import { initialValues } from '../constants';

describe('<MarketplaceSelectField />', () => {
  it('should show a placeholder', async () => {
    const props = {
      hasGcpQuota: true,
      hasRhmQuota: true,
    };
    render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        <MarketplaceSelectField {...props} />
      </Formik>,
    );
    expect(screen.queryByText('Select your marketplace')).toBeInTheDocument();
  });

  xit('should have 2 select items', async () => {});

  xit('selecting Red Hat marketplace sets the right field value', async () => {});

  xit('selecting Google cloud marketplace sets the right field value', async () => {});
});
