/* eslint-disable max-len */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Text,
  TextContent,
  Title,
  Stack,
  StackItem,
  PageSection,
} from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';

import links, { tools, channels } from '../../../common/installLinks';
import TelemetryDisclaimer from './instructions/components/TelemetryDisclaimer';
import TokenErrorAlert from './instructions/components/TokenErrorAlert';
import DownloadsAndPullSecretSection from './instructions/components/DownloadsAndPullSecretSection';
import DeveloperPreviewStatements from './instructions/components/DeveloperPreviewStatements';
import './instructions/InstructionsPreRelease.scss';

import Breadcrumbs from '../../common/Breadcrumbs';
import PageTitle from '../../common/PageTitle';

import { tollboothActions } from '../../../redux/actions';
import { scrollToTop } from '../../../common/helpers';

export class InstructionsAwsARM extends Component {
  componentDidMount() {
    scrollToTop();
    document.title = 'Install OpenShift 4 | AWS ARM (Developer Preview)';

    const { dispatch } = this.props;
    dispatch(tollboothActions.createAuthToken());
  }

  render() {
    const { token } = this.props;
    const breadcrumbs = (
      <Breadcrumbs path={[
        { label: 'Clusters' },
        { label: 'Create', path: '/create' },
        { label: 'AWS ARM Developer Preview' },
      ]}
      />
    );

    return (
      <>
        <PageTitle title="Install OpenShift Container Platform 4" breadcrumbs={breadcrumbs} />
        <PageSection>
          <Title headingLevel="h3" size="2xl">
            Developer Preview Builds for AWS (ARM)
          </Title>
          <Stack hasGutter>
            <StackItem>
              <Card className="ocm-c-pre-release__card">
                <CardTitle className="ocm-c-pre-release__card--header">
                  <CodeIcon />
                  {' '}
                  <span>
                    Developer Preview
                  </span>
                </CardTitle>
                <CardBody className="ocm-c-pre-release__card--body">
                  {token.error && <TokenErrorAlert token={token} />}
                  <TextContent>
                    <TelemetryDisclaimer />
                    <DeveloperPreviewStatements />
                    <Text component="p">
                      These preview builds are advantageous for planning future deployments,
                      ISV integrations, or other educational purposes.
                    </Text>
                  </TextContent>
                </CardBody>
              </Card>
            </StackItem>
            <StackItem>
              <Card className="ocm-c-pre-release-instructions__card">
                <CardBody className="ocm-c-pre-release-instructions__card--body">
                  <DownloadsAndPullSecretSection
                    token={token}
                    showPreReleaseDocs
                    showPreReleasePageLink
                    tool={tools.ARMINSTALLER}
                    channel={channels.STABLE}
                    preReleaseDocsLink={links.AWS_ARM_DOCS}
                    preReleasePageLink="/install/arm/pre-release"
                  />
                </CardBody>
                <CardFooter className="ocm-c-pre-release-instructions__card--footer">
                  <TextContent>
                    <Text component="h3">Feedback and Support</Text>
                    <Text component="p">
                      If you are a Red Hat customer or partner and have feedback about these ARM preview builds, open an issue
                      {' '}
                      <Text component="a" href={links.AWS_ARM_GITHUB}>
                        on our github repo
                      </Text>
                      . Do not use the formal Red Hat support service ticket process.
                      You can read more about support handling in the following
                      {' '}
                      <Text component="a" href={links.INSTALL_PRE_RELEASE_SUPPORT_KCS} rel="noreferrer noopener" target="_blank">
                        knowledge article
                      </Text>
                      .
                    </Text>
                  </TextContent>
                </CardFooter>
              </Card>
            </StackItem>
          </Stack>
        </PageSection>
      </>
    );
  }
}

InstructionsAwsARM.propTypes = {
  token: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({ token: state.tollbooth.token });

export default connect(mapStateToProps)(InstructionsAwsARM);
