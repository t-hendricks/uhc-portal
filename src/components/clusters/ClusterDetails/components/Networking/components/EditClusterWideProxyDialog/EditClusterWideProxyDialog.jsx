import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Form, Grid, GridItem, Text, Alert, Button } from '@patternfly/react-core';

import links from '~/common/installLinks.mjs';
import { validateUrl, validateCA, checkInvalidDNS } from '~/common/validators';

import Modal from '~/components/common/Modal/Modal';
import ErrorBox from '~/components/common/ErrorBox';
import PopoverHint from '~/components/common/PopoverHint';
import ExternalLink from '~/components/common/ExternalLink';
import ReduxFileUpload from '~/components/common/ReduxFormComponents/ReduxFileUpload';
import ReduxVerticalFormGroup from '~/components/common/ReduxFormComponents/ReduxVerticalFormGroup';
import { stringToArray, arrayToString } from '~/common/helpers';
import {
  HTTPS_PROXY_PLACEHOLDER,
  HTTP_PROXY_PLACEHOLDER,
  TRUST_BUNDLE_PLACEHOLDER,
  TRUST_BUNDLE_HELPER_TEXT,
  DISABLED_NO_PROXY_PLACEHOLDER,
  NO_PROXY_PLACEHOLDER,
  NO_PROXY_HELPER_TEXT,
} from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/networkingConstants';
import { MAX_FILE_SIZE, ACCEPT } from '../../../IdentityProvidersPage/components/CAUpload';

const validateUrlHttp = (value) => validateUrl(value, 'http');
const validateUrlHttps = (value) => validateUrl(value, 'https');
const validateAtLeastOne = (value, allValues) => {
  if (!allValues.httpProxyUrl && !allValues.httpsProxyUrl && !allValues.additionalTrustBundle) {
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
    noProxyDomains,
    formValues,
    additionalTrustBundle,
    anyTouched,
  } = props;

  const clusterProxyError = editClusterProxyResponse.error && (
    <ErrorBox message="Error editing cluster-wide proxy" response={editClusterProxyResponse} />
  );
  // sets trust bundle file upload depending on whether or not a trust bundle is already uploaded
  const [openFileUpload, setOpenFileUpload] = useState(!additionalTrustBundle);

  const noValues = !httpProxyUrl && !httpsProxyUrl && !additionalTrustBundle;

  const handleClose = () => {
    closeModal();
    reset();
    setOpenFileUpload(!additionalTrustBundle);
    clearClusterProxyResponse();
  };

  useEffect(() => {
    if (
      editClusterProxyResponse.fulfilled &&
      !editClusterProxyResponse.pending &&
      !editClusterProxyResponse.error
    ) {
      handleClose();
    }
  }, [editClusterProxyResponse]);

  const onFileRejected = () => {
    sendError();
  };

  const atLeastOneAlert = (
    <Alert isInline variant="warning" title="Complete at least 1 of the fields above." />
  );

  return isOpen && (
    <Modal
      onClose={handleClose}
      title="Edit cluster-wide Proxy"
      onPrimaryClick={handleSubmit}
      primaryText="Save"
      onSecondaryClick={handleClose}
      isPending={editClusterProxyResponse.pending}
      width="max(30%, 600px)"
    >
      {clusterProxyError}
      <Form>
        <Grid hasGutter>
          <GridItem>
            <Text>
              Enable an HTTP or HTTPS proxy to deny direct access to the Internet from your
              cluster
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
                placeholder={HTTP_PROXY_PLACEHOLDER}
                type="text"
                validate={[validateUrlHttp, validateAtLeastOne]}
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
              <Field
                component={ReduxVerticalFormGroup}
                name="noProxyDomains"
                label="No Proxy domains"
                placeholder={
                  !formValues.httpProxyUrl && !formValues.httpsProxyUrl
                    ? DISABLED_NO_PROXY_PLACEHOLDER
                    : NO_PROXY_PLACEHOLDER
                }
                type="text"
                parse={stringToArray}
                validate={checkInvalidDNS}
                helpText={NO_PROXY_HELPER_TEXT}
                showHelpTextOnError={false}
                isDisabled={!formValues.httpProxyUrl && !formValues.httpsProxyUrl}
              />
            </GridItem>
            <GridItem sm={12} md={10} xl2={11}>
              {!openFileUpload ? (
                <>
                  <Text className="ocm-c-networking-vpc-details__card pf-c-form__label-text pf-c-form__group-label">
                    Additional Trust Bundle{' '}
                    <PopoverHint
                      headerContent="Additional trust bundle"
                      bodyContent={TRUST_BUNDLE_HELPER_TEXT}
                    />
                  </Text>
                  <Text>
                    File Uploaded Successfully{' '}
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
            <GridItem>{anyTouched && noValues && atLeastOneAlert}</GridItem>
          </Grid>
        </Form>
      </Modal>
    )
  );
};

EditClusterWideProxyDialog.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  reset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  formValues: PropTypes.object,
  httpProxyUrl: PropTypes.string,
  httpsProxyUrl: PropTypes.string,
  noProxyDomains: PropTypes.array,
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
