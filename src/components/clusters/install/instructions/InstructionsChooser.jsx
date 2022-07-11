import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, CardBody, Title } from '@patternfly/react-core';
import { ConnectedIcon, SyncAltIcon, UserIcon } from '@patternfly/react-icons';
import CardBadge from '../../common/CardBadge';

const InstructionsChooser = (props) => {
  const {
    cloudName,
    showAI = false,
    hideIPI = false,
    ipiPageLink,
    hideUPI = false,
    upiPageLink,
    aiPageLink = '/assisted-installer/clusters/~new',
  } = props;
  return (
    <>
      <Card>
        <div className="pf-c-content ocm-page">
          <Title headingLevel="h3" size="2xl">
            {cloudName}
            : Select an installation type
          </Title>
          <div className="flex-container">
            {showAI && (
              <>
                <Link to={aiPageLink} className="ocm-c-ipi-upi-infra-card infra-card pf-c-card">
                  <CardBadge isRecommened />
                  <CardBody className="ocm-c-ipi-upi-infra-card--body">
                    <ConnectedIcon alt="Installer-Provisioned Infrastructure" />
                    <Title headingLevel="h3" size="lg">Assisted Installer</Title>
                    {' '}
                    Install OpenShift on your own infrastructure with step-by-step guidance.
                  </CardBody>
                </Link>
              </>
            )}
            {!hideIPI && (
              <>
                <Link to={ipiPageLink} className="ocm-c-ipi-upi-infra-card infra-card pf-c-card">
                  <CardBody className="ocm-c-ipi-upi-infra-card--body">
                    <SyncAltIcon alt="Installer-Provisioned Infrastructure" />
                    <Title headingLevel="h3" size="lg">Installer-provisioned infrastructure</Title>
                    {' '}
                    Deploy an OpenShift cluster on infrastructure that the installation program
                    provisions and the cluster maintains.
                  </CardBody>
                </Link>
              </>
            )}
            {!hideUPI && (
              <>
                <Link to={upiPageLink} className="ocm-c-ipi-upi-infra-card infra-card pf-c-card">
                  <CardBadge isHidden />
                  <CardBody className="ocm-c-ipi-upi-infra-card--body">
                    <UserIcon alt="User-Provisioned Infrastructure" />
                    <Title headingLevel="h3" size="lg">User-provisioned infrastructure</Title>
                    Deploy an OpenShift cluster on infrastructure that you prepare and maintain.
                  </CardBody>
                </Link>
              </>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

InstructionsChooser.propTypes = {
  cloudName: PropTypes.string.isRequired,
  showAI: PropTypes.bool,
  hideIPI: PropTypes.bool,
  ipiPageLink: PropTypes.string,
  hideUPI: PropTypes.bool,
  upiPageLink: PropTypes.string,
  aiPageLink: PropTypes.string,
};

export default InstructionsChooser;
