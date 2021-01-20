import React from 'react';
import PropTypes from 'prop-types';
import {
  PageSection,
  Title,
  Button,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

const ocpTableColumns = ['Infrastructure provider', 'Installation options'];
const ocpTableRows = [
  [(<><Link to="/install/metal">Bare Metal</Link></>),
    'Full stack automation and pre-existing infrastructure'],
  [(<><Link to="/install/ibmz/user-provisioned">IBM Z</Link></>),
    'Pre-existing infrastructure'],
  [(<><Link to="/install/power/user-provisioned">Power</Link></>),
    'Pre-existing infrastructure'],
  [(<><Link to="/install/openstack">Red Hat OpenStack</Link></>),
    'Full stack automation and pre-existing infrastructure'],
  [(<><Link to="/install/rhv">Red Hat Virtualization</Link></>),
    'Full stack automation and pre-existing infrastructure'],
  [(<><Link to="/install/vsphere/user-provisioned">vSphere</Link></>),
    'Full stack automation and pre-existing infrastructure'],
  [(<><Link to="/install/metal">Platform agnostic</Link></>),
    'Full stack automation and pre-existing infrastructure'],
];

const DatacenterTab = ({ assistedInstallerFeature }) => (
  <>
    {assistedInstallerFeature && (
      <PageSection variant="light">
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2">
            Assisted Installer
            </Title>
          </StackItem>
          <StackItem>
          Create a bare metal cluster with ease. From connecting your hardware to running
          pre-flight checks, the Assisted Installer guides you through the creation process.
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
          <Title headingLevel="h2" className="font-weight-light">
            {assistedInstallerFeature ? 'Other datacenter options' : 'datacenter options'}
          </Title>
        </StackItem>
        <StackItem>
        Create clusters in other environments using a downloadable installer program.
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
