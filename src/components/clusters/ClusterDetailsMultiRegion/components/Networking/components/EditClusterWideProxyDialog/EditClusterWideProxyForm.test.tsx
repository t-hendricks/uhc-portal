import React from 'react';
import { Formik } from 'formik';

import { useFormState } from '~/components/clusters/wizards/hooks/useFormState';
import { render, screen } from '~/testUtils';

import EditClusterWideProxyForm from './EditClusterWideProxyForm';

jest.mock('~/components/clusters/wizards/hooks/useFormState');

jest.mock('~/components/common/ReduxFormComponents_deprecated/ReduxFileUpload', () => () => (
  <div>MOCKED UPLOAD TEXT AREA</div>
));

describe('<EditClusterWideProxyForm />', () => {
  const mockedUseFormState = useFormState as jest.Mock;

  const defaultInitialValues = {
    http_proxy_url: undefined,
    https_proxy_url: undefined,
    no_proxy_domains: undefined,
    additional_trust_bundle: undefined,
  };

  const defaultUseFormStateReturn = {
    setFieldTouched: jest.fn(),
    setFieldValue: jest.fn(), // Set value of form field directly
    getFieldProps: jest.fn(), // Access: name, value, onBlur, onChange for a <Field>,
    getFieldMeta: jest.fn().mockReturnValue({}), // Access: error, touched for a <Field>
    values: {
      ...defaultInitialValues,
    },
  };

  const defaultProps = {
    isClusterEditError: false,
    clusterEditError: {},
    isClusterEditPending: false,
    submitForm: jest.fn(),
    handleClose: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('additional trust bundle', () => {
    it('shows text area if no trust bundle is loaded', async () => {
      mockedUseFormState.mockReturnValue(defaultUseFormStateReturn);
      render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <EditClusterWideProxyForm {...defaultProps} />
        </Formik>,
      );

      expect(await screen.findByText('MOCKED UPLOAD TEXT AREA')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Replace file' })).not.toBeInTheDocument();
    });

    it('shows "replace file" link instead of text area if trust bundle is loaded', async () => {
      mockedUseFormState.mockReturnValue({
        ...defaultUseFormStateReturn,
        values: { ...defaultInitialValues, additional_trust_bundle: 'I am a trust bundle' },
      });
      render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <EditClusterWideProxyForm {...defaultProps} />
        </Formik>,
      );

      expect(await screen.findByRole('button', { name: 'Replace file' })).toBeInTheDocument();
      expect(screen.queryByText('MOCKED UPLOAD TEXT AREA')).not.toBeInTheDocument();
    });

    it('shows text area when "replace file" link is clicked', async () => {
      mockedUseFormState.mockReturnValue({
        ...defaultUseFormStateReturn,
        values: { ...defaultInitialValues, additional_trust_bundle: 'I am a trust bundle' },
      });
      const { user } = render(
        <Formik initialValues={{}} onSubmit={() => {}}>
          <EditClusterWideProxyForm {...defaultProps} />
        </Formik>,
      );

      await user.click(screen.getByRole('button', { name: 'Replace file' }));
      expect(await screen.findByText('MOCKED UPLOAD TEXT AREA')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Replace file' })).not.toBeInTheDocument();
    });
  });
});
