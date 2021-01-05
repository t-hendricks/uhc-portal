import React from 'react';
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
  [(<><Link to="/create/metal">Bare Metal</Link></>),
    'Full stack automation and pre-existing infrastructure'],
  [(<><Link to="/create/ibmz/user-provisioned">IBM Z</Link></>),
    'Pre-existing infrastructure'],
  [(<><Link to="/create/power/user-provisioned">Power</Link></>),
    'Pre-existing infrastructure'],
  [(<><Link to="/create/openstack">Red Hat OpenStack</Link></>),
    'Full stack automation and pre-existing infrastructure'],
  [(<><Link to="/create/rhv">Red Hat Virtualization</Link></>),
    'Full stack automation and pre-existing infrastructure'],
  [(<><Link to="/create/vsphere/user-provisioned">vSphere</Link></>),
    'Full stack automation and pre-existing infrastructure'],
  [(<><Link to="/create/metal">Platform agnostic</Link></>),
    'Full stack automation and pre-existing infrastructure'],
];

const DatacenterTab = () => (
  <>
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
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2" className="light">
            Other datacenter options
          </Title>
        </StackItem>
        <StackItem>
        Create clusters in other environments using a downloadable installer program
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

export default DatacenterTab;
