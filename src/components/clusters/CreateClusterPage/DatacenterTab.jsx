import React from 'react';
import PropTypes from 'prop-types';
import { PageSection, Title, Button, Stack, StackItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

const ocpTableColumns = ['Infrastructure provider', 'Installation options'];
const ocpTableRows = [
  [
    <>
      <Link to="/install/metal">Bare Metal (x86_64)</Link>
    </>,
    'Full stack automation and pre-existing infrastructure',
  ],
  [
    <>
      <Link to="/install/arm">Bare Metal (ARM)</Link>
    </>,
    'Full stack automation and pre-existing infrastructure',
  ],
  [
    <>
      <Link to="/install/azure-stack-hub">Azure Stack Hub</Link>
    </>,
    'Full stack automation and pre-existing infrastructure',
  ],
  [
    <>
      <Link to="/install/ibmz/user-provisioned">IBM Z</Link>
    </>,
    'Pre-existing infrastructure',
  ],
  [
    <>
      <Link to="/install/power/user-provisioned">Power</Link>
    </>,
    'Pre-existing infrastructure',
  ],
  [
    <>
      <Link to="/install/nutanix/installer-provisioned">Nutanix AOS</Link>
    </>,
    'Full stack automation',
  ],
  [
    <>
      <Link to="/install/openstack">Red Hat OpenStack</Link>
    </>,
    'Full stack automation and pre-existing infrastructure',
  ],
  [
    <>
      <Link to="/install/rhv">Red Hat Virtualization</Link>
    </>,
    'Full stack automation and pre-existing infrastructure',
  ],
  [
    <>
      <Link to="/install/vsphere">vSphere</Link>
    </>,
    'Full stack automation and pre-existing infrastructure',
  ],
  [
    <>
      <Link to="/install/platform-agnostic">Platform agnostic (x86_64)</Link>
    </>,
    'Pre-existing infrastructure',
  ],
];

const DatacenterTab = ({ assistedInstallerFeature }) => (
  <>
    {assistedInstallerFeature && (
      <PageSection variant="light">
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2" className="ocm-ocp-datacenter-title">
              Assisted Installer
            </Title>
          </StackItem>
          <StackItem>
            The easiest way to install OpenShift on your own infrastructure with step-by-step
            guidance, preflight validations, and smart defaults. This method supports both x86-64
            and arm64 CPU architectures.
          </StackItem>
          <StackItem>
            <Button component={Link} to="/assisted-installer/clusters/~new">
              Create cluster
            </Button>
          </StackItem>
        </Stack>
      </PageSection>
    )}
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2">
            {assistedInstallerFeature ? 'Other datacenter options' : 'datacenter options'}
          </Title>
        </StackItem>
        <StackItem>
          Create clusters on supported infrastructure using our extensive documentation and
          installer program.
        </StackItem>
        <StackItem>
          <Table
            className="install-options-table"
            aria-label="Installation options table"
            cells={ocpTableColumns}
            rows={ocpTableRows}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </StackItem>
      </Stack>
    </PageSection>
  </>
);

DatacenterTab.propTypes = {
  assistedInstallerFeature: PropTypes.bool,
};

export default DatacenterTab;
