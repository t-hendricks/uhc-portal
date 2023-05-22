import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';

const AwsVpcTable = ({ vpcs, showPublicFields }) => {
  const colSize = showPublicFields ? 3 : 6;
  return (
    <Grid>
      <GridItem md={colSize}>
        <strong>Availability zone</strong>
      </GridItem>
      <GridItem md={colSize}>
        <strong>Private subnet ID</strong>
      </GridItem>
      {showPublicFields && (
        <>
          <GridItem md={colSize}>
            <strong>Public subnet ID</strong>
          </GridItem>
          <GridItem md={colSize} />
        </>
      )}
      {vpcs.map((vpc) => (
        <>
          <GridItem md={colSize}>{vpc.az}</GridItem>
          <GridItem md={colSize}>{vpc.privateSubnet}</GridItem>
          {showPublicFields && (
            <>
              <GridItem md={colSize}>{vpc.publicSubnet}</GridItem>
              <GridItem md={colSize} />
            </>
          )}
        </>
      ))}
    </Grid>
  );
};

AwsVpcTable.propTypes = {
  vpcs: PropTypes.arrayOf(
    PropTypes.shape({
      publicSubnet: PropTypes.string,
      privateSubnet: PropTypes.string,
      az: PropTypes.string,
    }),
  ),
  showPublicFields: PropTypes.bool,
};

export default AwsVpcTable;
