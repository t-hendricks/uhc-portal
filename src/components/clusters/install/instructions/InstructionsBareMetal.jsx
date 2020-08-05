import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button, Card, CardBody, Title,
} from '@patternfly/react-core';
import { UserIcon, ConnectedIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_primary_color_100 } from '@patternfly/react-tokens';
import { NewClusterModal } from 'facet-lib';
import CardBadge from '../../common/CardBadge';

export const InstructionsBareMetal = ({ history }) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      <Card>
        <div className="pf-c-content ocm-page">
          <Title headingLevel="h3" size="2xl">
            Bare Metal: Select an installation type
          </Title>
          <div className="flex-container">
            <Button onClick={() => setModalOpen(true)} variant="link" className="aws-ipi-upi-infra-card infra-card pf-c-card infra-card-button" data-testid="ai-button">
              <CardBadge isDevPreview devPreviewText="Technology Preview" />
              <CardBody>
                <ConnectedIcon color={global_primary_color_100.value} size="xl" alt="Installer-Provisioned Infrastructure" className="aws-ipi-upi-infra-logo" />
                <Title headingLevel="h3" size="lg">Assisted Bare Metal Installer</Title>
                {' '}
                Deploy an OpenShift 4.6 cluster on your own infrastructure using a Discovery ISO
                that makes it easy to connect discovered hardware.
              </CardBody>
            </Button>
            <Link to="/install/metal/user-provisioned" className="aws-ipi-upi-infra-card infra-card pf-c-card">
              <CardBadge isHidden />
              <CardBody>
                <UserIcon color={global_primary_color_100.value} size="xl" alt="User-Provisioned Infrastructure" className="aws-ipi-upi-infra-logo" />
                <Title headingLevel="h3" size="lg">User-provisioned infrastructure</Title>
                Deploy an OpenShift cluster on infrastructure that you prepare and maintain.
              </CardBody>
            </Link>
          </div>
        </div>
      </Card>
      {isModalOpen && <NewClusterModal closeModal={() => setModalOpen(false)} history={history} />}
    </>
  );
};

InstructionsBareMetal.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(InstructionsBareMetal);
