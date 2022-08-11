import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Form,
  Grid,
  GridItem,
  Title,
  Text,
  Alert,
  Button,
} from '@patternfly/react-core';
import PopoverHint from '../../../../../../../common/PopoverHint';
import Modal from '../../../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../../../common/ErrorBox';
import ExternalLink from '../../../../../../../common/ExternalLink';
import links from '../../../../../../../../common/installLinks.mjs';
import ReduxVerticalFormGroup from '../../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import ReduxFileUpload from '../../../../../../../common/ReduxFormComponents/ReduxFileUpload';
import {
  HTTPS_PROXY_PLACEHOLDER,
  TRUST_BUNDLE_PLACEHOLDER,
} from '../../../../../../CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/networkingPlaceholders';
import {
  validateUrl,
  validateCA,
} from '../../../../../../../../common/validators';
import { MAX_FILE_SIZE, ACCEPT } from '../../../../IdentityProvidersPage/components/CAUpload';

const validateUrlHttps = value => validateUrl(value, ['http', 'https']);
const validateAtLeastOne = (value, allValues) => {
  if (
    !allValues.httpProxyUrl
    && !allValues.httpsProxyUrl
    && !allValues.additionalTrustBundle
  ) {
    return 'Configure at least one of the cluster-wide proxy fields.';
  }
  return undefined;
};

const EditClusterWideProxyDialog = (props) => {
  const {
    isOpen,
    closeModal,
    sendError,
    reset,
    handleSubmit,
    editClusterProxyResponse,
    clearClusterProxyResponse,
    httpProxyUrl,
    httpsProxyUrl,
    additionalTrustBundle,
    anyTouched,
  } = props;

  const clusterProxyError = editClusterProxyResponse.error && (
    <ErrorBox message="Error editing cluster-wide proxy" response={editClusterProxyResponse} />
  );
  // sets trust bundle file upload depending on whether or not a trust bundle is already uploaded
  const [openFileUpload, setOpenFileUpload] = useState(!additionalTrustBundle);

  const noValues = () => !httpProxyUrl && !httpsProxyUrl && !additionalTrustBundle;

  const handleClose = () => {
    closeModal();
    reset();
    setOpenFileUpload(!additionalTrustBundle);
    clearClusterProxyResponse();
  };

  useEffect(() => {
    if (editClusterProxyResponse.fulfilled
      && !editClusterProxyResponse.pending
      && !editClusterProxyResponse.error) {
      handleClose();
    }
  }, [editClusterProxyResponse]);

  const onFileRejected = () => {
    sendError();
  };

  const atLeastOneAlert = (
    <Alert
      isInline
      variant="warning"
      title="Complete at least 1 of the fields above."
    />
  );

  return isOpen && (
    <Modal
      onClose={handleClose}
      title="Edit cluster-wide proxy"
      onPrimaryClick={handleSubmit}
      onSecondaryClick={handleClose}
      isPending={editClusterProxyResponse.pending}
      width="max(30%, 600px)"
    >
      {clusterProxyError}
      <Form>
        <Grid hasGutter>
          <GridItem>
            <Title headingLevel="h3">Cluster-wide proxy</Title>
          </GridItem>
          <GridItem>
            <Text>
              Enable an HTTP or HTTPS proxy to deny
              {' '}
              direct access to the Internet from your cluster
            </Text>
            <Text className="pf-u-mt-sm">
              <ExternalLink href={links.CONFIGURE_PROXY_URL}>
                Learn more about configuring a cluster-wide proxy
              </ExternalLink>
            </Text>
          </GridItem>

          <GridItem>
            <Alert
              variant="info"
              isInline
              isPlain
              title="Configure at least 1 of the following fields:"
            />
          </GridItem>

          <GridItem sm={12} md={10} xl2={11}>
            <Field
              component={ReduxVerticalFormGroup}
              name="httpProxyUrl"
              label="HTTP proxy URL"
              placeholder={HTTPS_PROXY_PLACEHOLDER}
              type="text"
              validate={[validateAtLeastOne, validateUrlHttps]}
              helpText="Specify a proxy URL to use for HTTP connections outside the cluster."
              showHelpTextOnError={false}
            />
          </GridItem>

          <GridItem sm={12} md={10} xl2={11}>
            <Field
              component={ReduxVerticalFormGroup}
              name="httpsProxyUrl"
              label="HTTPS proxy URL"
              placeholder={HTTPS_PROXY_PLACEHOLDER}
              type="text"
              validate={[validateUrlHttps, validateAtLeastOne]}
              helpText="Specify a proxy URL to use for HTTPS connections outside the cluster."
              showHelpTextOnError={false}
            />
          </GridItem>

          <GridItem sm={12} md={10} xl2={11}>
            {!openFileUpload ? (
              <>
                <Text className="ocm-c-networking-vpc-details__card pf-c-form__label-text pf-c-form__group-label">
                  Additional Trust Bundle
                  {' '}
                  <PopoverHint
                    headerContent="Additional trust bundle"
                    bodyContent="An additional trust bundle is a PEM encoded X.509 certificate bundle that will be added to the nodes' trusted certificate store."
                  />
                </Text>
                <Text>
                  File Uploaded Successfully
                  {' '}
                  <Button
                    // opens field to replace addition trust bundle
                    onClick={() => setOpenFileUpload(true)}
                    variant="link"
                    isInline
                    className="ocm-c-networking-vpc-details__card--replace-button"
                  >
                    Replace file
                  </Button>
                </Text>
              </>
            ) : (
              <Field
                component={ReduxFileUpload}
                name="additionalTrustBundle"
                label="Additional trust bundle"
                placeholder={TRUST_BUNDLE_PLACEHOLDER}
                extendedHelpTitle="Additional trust bundle"
                extendedHelpText="An additional trust bundle is a PEM encoded X.509 certificate bundle that will be added to the nodes' trusted certificate store."
                validate={[validateCA, validateAtLeastOne]}
                dropzoneProps={{
                  accept: ACCEPT,
                  maxSize: MAX_FILE_SIZE,
                  onDropRejected: onFileRejected,
                }}
                helpText="Upload or paste a PEM encoded X.509 certificate."
              />
            )}
          </GridItem>
          <GridItem sm={0} md={2} xl2={4} />
          <GridItem>
            {anyTouched && noValues && atLeastOneAlert}
          </GridItem>
        </Grid>
      </Form>
    </Modal>
  );
};

EditClusterWideProxyDialog.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  reset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  httpProxyUrl: PropTypes.string,
  httpsProxyUrl: PropTypes.string,
  additionalTrustBundle: PropTypes.string,
  editClusterProxyResponse: PropTypes.shape({
    error: PropTypes.bool,
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
  }).isRequired,
  sendError: PropTypes.func,
  anyTouched: PropTypes.bool,
  clearClusterProxyResponse: PropTypes.func,
};

export default EditClusterWideProxyDialog;
