import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import Quota from '../Quota';

import * as Fixtures from './Quota.fixtures';

describe('<Quota />', () => {
  describe('Quota', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it.skip('is accessible', async () => {
      const { container } = render(
        <TestRouter>
          <CompatRouter>
            <Quota {...Fixtures} />
          </CompatRouter>
        </TestRouter>,
      );
      expect(await screen.findByText('OpenShift Dedicated')).toBeInTheDocument();

      // Throws a "Heading levels should only increase by one (heading-order)" error
      await checkAccessibility(container);
    });

    it('should call fetch method', async () => {
      expect(Fixtures.fetchAccount).not.toHaveBeenCalled();
      render(
        <TestRouter>
          <CompatRouter>
            <Quota {...Fixtures} />
          </CompatRouter>
        </TestRouter>,
      );
      expect(await screen.findByText('OpenShift Dedicated')).toBeInTheDocument();

      expect(Fixtures.fetchAccount).toHaveBeenCalled();
    });

    it('should have Header, OCP and OSD cards', async () => {
      render(
        <TestRouter>
          <CompatRouter>
            <Quota {...Fixtures} />
          </CompatRouter>
        </TestRouter>,
      );

      expect(await screen.findByText('OpenShift Dedicated')).toBeInTheDocument();

      expect(
        screen.getByRole('heading', { level: 1, name: 'Dedicated (Annual)' }),
      ).toBeInTheDocument();
    });
  });
});
