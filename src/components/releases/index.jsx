import React from 'react';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Divider,
  Gallery,
  GalleryItem,
  PageSection,
  Popover,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

import getReleaseNotesLink from './getReleaseNotesLink';
import ExternalLink from '../common/ExternalLink';
import getOCPLifeCycleStatus from '../../services/productLifeCycleService';
import SupportStatus from '../common/SupportStatus';
import ReleaseChannel from './ReleaseChannel';
import './Releases.scss';

const Releases = () => {
  const [statusData, setStatusData] = React.useState({ data: [] });
  React.useEffect(() => {
    const fetchStatusData = async () => {
      const result = await getOCPLifeCycleStatus();

      setStatusData(result.data.data);
    };

    fetchStatusData();
  }, []);
  React.useEffect(() => {
    document.title = 'Releases | Red Hat OpenShift Cluster Manager';
  }, []);

  const allVersions = statusData[0]?.versions;
  const filteredVersions = allVersions?.filter(version => !version.name.includes('EUS'));
  const versionsToDisplay = filteredVersions?.splice(0, 4);
  const hasEUSChannel = versionName => allVersions?.find(v => v.name.includes(`${versionName} EUS`));
  const latestVersion = versionsToDisplay ? versionsToDisplay[0]?.name : '4.7';
  const renderProductName = versionName => (
    <>
      OpenShift
      {' '}
      {versionName}
    </>
  );

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Releases" className="page-title" />
      </PageHeader>
      <PageSection className="ocm-p-releases">
        <Stack hasGutter>
          <StackItem className="ocm-l-ocp-releases__section">
            <Card>
              <CardTitle>
                Latest OpenShift releases
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <StackItem>
                    View general information on the most recent OpenShift Container Platform
                    release versions that you can install. Versions are only supported when
                    released to the fast, stable, or eus channels.
                  </StackItem>
                  <Gallery hasGutter>
                    {versionsToDisplay?.map(version => (
                      <GalleryItem key={version.name}>
                        <Card isFlat className="ocm-l-ocp-releases__card">
                          <CardTitle>
                            <div className="ocm-l-ocp-releases__card-title pf-u-mb-sm">
                              {getReleaseNotesLink(version.name) ? (
                                <ExternalLink href={getReleaseNotesLink(version.name)} noIcon>
                                  {renderProductName(version.name)}
                                </ExternalLink>
                              ) : (
                                renderProductName(version.name)
                              )}
                            </div>
                            <SupportStatus status={version.type} />
                            <Divider className="ocm-l-ocp-releases__divider pf-u-mt-xl pf-u-mb-sm" />
                          </CardTitle>
                          <CardBody>
                            <div className="ocm-l-ocp-releases__subheading">
                              Channel details
                            </div>
                            <dl className="ocm-l-ocp-releases__channels pf-c-description-list__group">
                              <ReleaseChannel channel={`stable-${version.name}`} />
                              <ReleaseChannel channel={`fast-${version.name}`} />
                              {hasEUSChannel(version.name) && <ReleaseChannel channel={`eus-${version.name}`} />}
                              <ReleaseChannel channel={`candidate-${version.name}`} />
                            </dl>
                          </CardBody>
                        </Card>
                      </GalleryItem>
                    ))}
                  </Gallery>
                  <StackItem>
                    <Popover
                      aria-label="Version help"
                      bodyContent={
                        (
                          <>
                            <p className="pf-u-mb-md">
                              The most recent versions aren&apos;t always available for every
                              cluster. To keep your cluster up to date with the recommended
                              version, run regular updates from the
                              {' '}
                              <Link to="/">clusters list</Link>
                              .
                            </p>
                            <p>
                              <em>Note:</em>
                              {' '}
                              Disconnected clusters won&apos;t show available recommended
                              updates on the clusters list.
                            </p>
                          </>
                        )
                      }
                      id="version-help"
                    >
                      <Button variant="link" isInline>
                        I don&apos;t see these versions as upgrade options for my cluster.
                        {' '}
                        <OutlinedQuestionCircleIcon />
                      </Button>
                    </Popover>
                  </StackItem>
                </Stack>
              </CardBody>
            </Card>
          </StackItem>
          <StackItem className="ocm-l-osd-releases__section">
            <Card>
              <CardTitle>
                Channels
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <StackItem>
                    {`Channels recommend release versions and help control the pace of updates.
                    Update channels are tied to a minor version of OpenShift Container Platform,
                    for example ${latestVersion}. To update to the next minor release, you may need to change
                    the channel you're in.`}
                  </StackItem>
                  <StackItem>
                    <ExternalLink
                      href={`https://docs.openshift.com/container-platform/${latestVersion}/updating/updating-cluster-between-minor.html`}
                      noIcon
                    >
                      Learn more about updating channels
                    </ExternalLink>
                  </StackItem>
                </Stack>
              </CardBody>
            </Card>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};

export default Releases;
