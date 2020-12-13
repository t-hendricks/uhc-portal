import React from 'react';
import PropTypes from 'prop-types';
import {
  Title,
  GridItem,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxCheckbox from '../../../../../common/ReduxFormComponents/ReduxCheckbox';
import SubnetFieldsRow from './SubnetFieldsRow';

class InstallToVPC extends React.Component {
  render() {
    const { selectedRegion, isMultiAz, selected } = this.props;
    return (
      <>
        <GridItem span={4}>
          <Field
            component={ReduxCheckbox}
            name="install_to_vpc"
            label="Install into an existing VPC"
            onChange={this.handleVPCCheckbox}
          />
        </GridItem>
        <GridItem span={8} />
        {
          selected && (
            <>
              <GridItem span={12}>
                <Title headingLevel="h4" size="md">Existing VPC</Title>
                To install into an existing VPC you need to ensure that your VPC is configured
                with a public and a private subnet for each availability zone that you want
                the cluster installed into.
              </GridItem>
              <SubnetFieldsRow
                showLabels
                index={0}
                selectedRegion={selectedRegion}
              />
              {
                isMultiAz && (
                  <>
                    <SubnetFieldsRow
                      index={1}
                      selectedRegion={selectedRegion}
                    />
                    <SubnetFieldsRow
                      index={2}
                      selectedRegion={selectedRegion}
                    />
                  </>
                )
              }
            </>
          )
        }
      </>
    );
  }
}

InstallToVPC.propTypes = {
  selectedRegion: PropTypes.string,
  isMultiAz: PropTypes.bool,
  selected: PropTypes.bool,
};

export default InstallToVPC;
